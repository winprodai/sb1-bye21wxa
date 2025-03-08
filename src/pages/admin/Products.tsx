"use client"

import React, { useState, useEffect } from "react"
import { Plus, Search, Filter, Trash2, Edit, ChevronDown, Lock, Unlock, Save, X, ImageIcon } from "lucide-react"
import { supabase } from "../../lib/supabase"

interface Product {
  id: string
  name: string
  description: string
  selling_price: number
  product_cost: number
  profit_margin: number
  is_locked: boolean
  images: string[]
  created_at: string
  stats: any // Customize as needed
  specifications: any // Customize as needed
  is_top_product?: boolean
  priority?: number
  // No category_ids field as it's in a junction table
}

interface Category {
  id: string
  name: string
}

interface ProductFormData {
  name: string
  description: string
  selling_price: string | number
  product_cost: string | number
  is_locked: boolean
  category_ids: string[] // We'll keep this in the form data for UI purposes
  images: string[]
  stats: {
    engagement: string
    fbAds: string
    targetingInfo: string
    searchVolume: {
      monthly: number
      trend: string
      relatedTerms: string[]
    }
    aliexpressOrders: {
      daily: number
      weekly: number
      monthly: number
      trend: string
    }
  }
  specifications: {
    material: string
    dimensions: {
      small: string
      large: string
    }
  }
  is_top_product: boolean
  priority: number
}

interface ProductWithCategories extends Product {
  categories: Category[]
}

const fetchProductsAPI = async (): Promise<ProductWithCategories[]> => {
  try {
    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (productsError) throw productsError

    // For each product, fetch its categories
    const productsWithCategories = await Promise.all(
      (products || []).map(async (product) => {
        // Get category IDs for this product from the junction table
        const { data: productCategories, error: junctionError } = await supabase
          .from("product_categories")
          .select("category_id")
          .eq("product_id", product.id)

        if (junctionError) throw junctionError

        // Get the actual category objects
        const categoryIds = productCategories?.map((pc) => pc.category_id) || []
        let categories: Category[] = []

        if (categoryIds.length > 0) {
          const { data: categoryData, error: categoriesError } = await supabase
            .from("categories")
            .select("*")
            .in("id", categoryIds)

          if (categoriesError) throw categoriesError
          categories = categoryData || []
        }

        return {
          ...product,
          categories,
        }
      }),
    )

    return productsWithCategories
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

const fetchCategoriesAPI = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

/**
 * Create a new product and its category relationships.
 * @param productData - The data for the new product.
 * @returns The newly created product with its categories.
 */
const createProductAPI = async (
  productData: Partial<Product>,
  categoryIds: string[],
): Promise<ProductWithCategories | null> => {
  try {
    // First, create the product
    const { data: product, error: productError } = await supabase.from("products").insert([productData]).select()

    if (productError) throw productError
    if (!product || product.length === 0) return null

    const newProduct = product[0]

    // Then, create the category relationships
    if (categoryIds.length > 0) {
      const categoryRelations = categoryIds.map((categoryId) => ({
        product_id: newProduct.id,
        category_id: categoryId,
      }))

      const { error: relationError } = await supabase.from("product_categories").insert(categoryRelations)

      if (relationError) throw relationError
    }

    // Return the product with its categories
    return {
      ...newProduct,
      categories: await getCategoriesForProduct(newProduct.id),
    }
  } catch (error) {
    console.error("Error creating product:", error)
    return null
  }
}

/**
 * Update an existing product and its category relationships.
 * @param id - The ID of the product to update.
 * @param productData - The updated product data.
 * @param categoryIds - The updated category IDs.
 * @returns The updated product with its categories.
 */
const updateProductAPI = async (
  id: string,
  productData: Partial<Product>,
  categoryIds: string[],
): Promise<ProductWithCategories | null> => {
  try {
    // First, update the product
    const { data: product, error: productError } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()

    if (productError) throw productError
    if (!product || product.length === 0) return null

    const updatedProduct = product[0]

    // Then, delete existing category relationships
    const { error: deleteError } = await supabase.from("product_categories").delete().eq("product_id", id)

    if (deleteError) throw deleteError

    // Finally, create new category relationships
    if (categoryIds.length > 0) {
      const categoryRelations = categoryIds.map((categoryId) => ({
        product_id: id,
        category_id: categoryId,
      }))

      const { error: relationError } = await supabase.from("product_categories").insert(categoryRelations)

      if (relationError) throw relationError
    }

    // Return the product with its categories
    return {
      ...updatedProduct,
      categories: await getCategoriesForProduct(id),
    }
  } catch (error) {
    console.error("Error updating product:", error)
    return null
  }
}

/**
 * Get categories for a specific product.
 * @param productId - The ID of the product.
 * @returns Array of categories.
 */
const getCategoriesForProduct = async (productId: string): Promise<Category[]> => {
  try {
    // Get category IDs for this product from the junction table
    const { data: productCategories, error: junctionError } = await supabase
      .from("product_categories")
      .select("category_id")
      .eq("product_id", productId)

    if (junctionError) throw junctionError

    // Get the actual category objects
    const categoryIds = productCategories?.map((pc) => pc.category_id) || []

    if (categoryIds.length === 0) return []

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .in("id", categoryIds)

    if (categoriesError) throw categoriesError
    return categories || []
  } catch (error) {
    console.error("Error fetching categories for product:", error)
    return []
  }
}

/**
 * Delete a product.
 * @param id - The ID of the product to delete.
 * @returns Boolean indicating success.
 */
const deleteProductAPI = async (id: string): Promise<boolean> => {
  try {
    // The junction table entries will be automatically deleted due to ON DELETE CASCADE
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

/**
 * Bulk delete products.
 * @param ids - Array of product IDs to delete.
 * @returns Boolean indicating success.
 */
const deleteMultipleProductsAPI = async (ids: string[]): Promise<boolean> => {
  try {
    // The junction table entries will be automatically deleted due to ON DELETE CASCADE
    const { error } = await supabase.from("products").delete().in("id", ids)
    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting multiple products:", error)
    return false
  }
}

/**
 * Toggle the lock status of a product.
 * @param product - The product whose lock status should be toggled.
 * @returns The updated product.
 */
const toggleLockAPI = async (product: Product): Promise<ProductWithCategories | null> => {
  try {
    const updatedLockStatus = !product.is_locked
    const { data, error } = await supabase
      .from("products")
      .update({ is_locked: updatedLockStatus })
      .eq("id", product.id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) return null

    return {
      ...data[0],
      categories: await getCategoriesForProduct(product.id),
    }
  } catch (error) {
    console.error("Error toggling lock status:", error)
    return null
  }
}

/**
 * Create a default "Profit & Cost" addon for a product.
 * @param product - The product to create the addon for.
 */
const createDefaultProfitCostAddon = async (product: ProductWithCategories) => {
  try {
    // Create default content for the profit_cost addon
    const defaultContent = {
      show_selling_price: true,
      show_product_cost: true,
      show_profit_margin: true,
      selling_price: product.selling_price,
      product_cost: product.product_cost,
      profit_margin: (product.selling_price - product.product_cost).toFixed(2),
      custom_text: "",
    }

    // Check if this product already has a profit_cost addon
    const { data: existingAddons, error: checkError } = await supabase
      .from("product_addons")
      .select("*")
      .eq("product_id", product.id)
      .eq("type", "profit_cost")

    if (checkError) throw checkError

    // Only create if no existing addon of this type for this product
    if (!existingAddons || existingAddons.length === 0) {
      const addonData = {
        type: "profit_cost",
        title: "Your Profit & Cost",
        content: JSON.stringify(defaultContent, null, 2),
        enabled: true,
        order: 1,
        product_id: product.id,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const { error } = await supabase.from("product_addons").insert([addonData])
      if (error) throw error
      console.log("Created default profit_cost addon for product:", product.id)
    }
  } catch (error) {
    console.error("Error creating default profit_cost addon:", error)
    // Don't block product creation if addon creation fails
  }
}

/**
 * Update the "Profit & Cost" addon for a product when the product is updated.
 * @param product - The updated product.
 */
const updateProductProfitCostAddon = async (product: ProductWithCategories) => {
  try {
    // Find existing profit_cost addon for this product
    const { data: existingAddons, error: checkError } = await supabase
      .from("product_addons")
      .select("*")
      .eq("product_id", product.id)
      .eq("type", "profit_cost")

    if (checkError) throw checkError

    if (existingAddons && existingAddons.length > 0) {
      // Update existing addon
      const existingAddon = existingAddons[0]
      let contentObj = {}

      try {
        contentObj = JSON.parse(existingAddon.content)
      } catch (e) {
        // If parsing fails, create new content object
        contentObj = {
          show_selling_price: true,
          show_product_cost: true,
          show_profit_margin: true,
          custom_text: "",
        }
      }

      // Update the price values
      contentObj.selling_price = product.selling_price
      contentObj.product_cost = product.product_cost
      contentObj.profit_margin = (product.selling_price - product.product_cost).toFixed(2)

      const { error } = await supabase
        .from("product_addons")
        .update({
          content: JSON.stringify(contentObj, null, 2),
          updated_at: new Date(),
        })
        .eq("id", existingAddon.id)

      if (error) throw error
      console.log("Updated profit_cost addon for product:", product.id)
    } else {
      // Create new addon if it doesn't exist
      await createDefaultProfitCostAddon(product)
    }
  } catch (error) {
    console.error("Error updating profit_cost addon:", error)
    // Don't block product update if addon update fails
  }
}

// Update the convertFormDataToProductData function to exclude category_ids
const convertFormDataToProductData = (formData: ProductFormData): Partial<Product> => {
  // Calculate profit margin
  const sellingPrice =
    typeof formData.selling_price === "string" ? Number.parseFloat(formData.selling_price) : formData.selling_price

  const productCost =
    typeof formData.product_cost === "string" ? Number.parseFloat(formData.product_cost) : formData.product_cost

  return {
    name: formData.name,
    description: formData.description,
    selling_price: sellingPrice,
    product_cost: productCost,
    is_locked: formData.is_locked,
    images: formData.images,
    stats: formData.stats,
    specifications: formData.specifications,
    is_top_product: formData.is_top_product,
    priority: formData.priority,
  }
}

const AdminProducts: React.FC = () => {
  // State variables
  const [products, setProducts] = useState<ProductWithCategories[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithCategories | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<Category[]>([])

  // Local state for modal form
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    selling_price: "",
    product_cost: "",
    is_locked: true,
    category_ids: [],
    images: [] as string[],
    stats: {
      engagement: "Medium",
      fbAds: "Active",
      targetingInfo: "Available",
      searchVolume: {
        monthly: 0,
        trend: "increasing",
        relatedTerms: [],
      },
      aliexpressOrders: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        trend: "increasing",
      },
    },
    specifications: {
      material: "",
      dimensions: {
        small: "",
        large: "",
      },
    },
    is_top_product: false,
    priority: 0,
  })
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // ----------------------------
  // Data Fetching
  // ----------------------------

  // Fetch products when component mounts
  useEffect(() => {
    ;(async () => {
      const productsData = await fetchProductsAPI()
      const categoriesData = await fetchCategoriesAPI()
      setProducts(productsData)
      setCategories(categoriesData)
      setLoading(false)
    })()
  }, [])

  const handleDeleteProducts = async () => {
    if (!window.confirm("Are you sure you want to delete the selected products?")) return
    const success = await deleteMultipleProductsAPI(selectedProducts)
    if (success) {
      setProducts(products.filter((p) => !selectedProducts.includes(p.id)))
      setSelectedProducts([])
    }
  }

  /**
   * Handle deletion of a single product.
   * @param id - The ID of the product to delete.
   */
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    const success = await deleteProductAPI(id)
    if (success) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  /**
   * Toggle the lock status of a product.
   * @param product - The product to toggle.
   */
  const toggleLock = async (product: ProductWithCategories) => {
    const updatedProduct = await toggleLockAPI(product)
    if (updatedProduct) {
      setProducts(products.map((p) => (p.id === product.id ? updatedProduct : p)))
    }
  }

  /**
   * Toggle the expansion of a product row to show extra details.
   * @param productId - The product ID to expand/collapse.
   */
  const toggleRowExpansion = (productId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) newSet.delete(productId)
      else newSet.add(productId)
      return newSet
    })
  }

  // Update the resetFormData function
  const resetFormData = () => {
    setFormData({
      name: "",
      description: "",
      selling_price: "",
      product_cost: "",
      is_locked: true,
      category_ids: [],
      images: [],
      stats: {
        engagement: "Medium",
        fbAds: "Active",
        targetingInfo: "Available",
        searchVolume: {
          monthly: 0,
          trend: "increasing",
          relatedTerms: [],
        },
        aliexpressOrders: {
          daily: 0,
          weekly: 0,
          monthly: 0,
          trend: "increasing",
        },
      },
      specifications: {
        material: "",
        dimensions: {
          small: "",
          large: "",
        },
      },
      is_top_product: false,
      priority: 0,
    })
    setIsEditing(false)
    setEditingProduct(null)
  }

  /**
   * Handle submission of the add product form.
   */
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    // Convert form data to product data (excluding category_ids)
    const productData = convertFormDataToProductData(formData)
    const categoryIds = formData.category_ids

    const newProduct = await createProductAPI(productData, categoryIds)
    if (newProduct) {
      // Create a default "Profit & Cost" addon for this product
      await createDefaultProfitCostAddon(newProduct)

      setProducts([newProduct, ...products])
      resetFormData()
      setShowAddModal(false)
    }
  }

  /**
   * Handle submission of the edit product form.
   */
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    // Convert form data to product data (excluding category_ids)
    const productData = convertFormDataToProductData(formData)
    const categoryIds = formData.category_ids

    console.log("Updating product:", editingProduct.id, productData, categoryIds)

    const updated = await updateProductAPI(editingProduct.id, productData, categoryIds)
    if (updated) {
      console.log("Product updated successfully:", updated)

      // Update the profit_cost addon for this product
      await updateProductProfitCostAddon(updated)

      setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)))
      resetFormData()
      setShowEditModal(false)
    } else {
      console.error("Failed to update product")
    }
  }

  /**
   * Handle image upload and update form data with image URLs.
   * @param files - The files to upload.
   */
  const handleImageUpload = async (files: FileList) => {
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `product-images/${fileName}` //folder-name, file

        const { error: uploadError } = await supabase.storage
          .from("productImages") //bucket name
          .upload(filePath, file)
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from("productImages").getPublicUrl(filePath)
        if (data?.publicUrl) {
          urls.push(data.publicUrl)
        }
      }
      setFormData((prev: ProductFormData) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }))
    } catch (error) {
      console.error("Error uploading images:", error)
    }
  }

  // Update the useEffect to handle categories from the product
  useEffect(() => {
    if (isEditing && editingProduct) {
      console.log("Editing product:", editingProduct)
      setFormData({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        selling_price: editingProduct.selling_price || "",
        product_cost: editingProduct.product_cost || "",
        is_locked: editingProduct.is_locked || false,
        category_ids: editingProduct.categories?.map((c) => c.id) || [],
        images: editingProduct.images || [],
        is_top_product: editingProduct.is_top_product || false,
        priority: editingProduct.priority || 0,
        stats: editingProduct.stats || {
          engagement: "Medium",
          fbAds: "Active",
          targetingInfo: "Available",
          searchVolume: {
            monthly: 0,
            trend: "increasing",
            relatedTerms: [],
          },
          aliexpressOrders: {
            daily: 0,
            weekly: 0,
            monthly: 0,
            trend: "increasing",
          },
        },
        specifications: editingProduct.specifications || {
          material: "",
          dimensions: {
            small: "",
            large: "",
          },
        },
      })
    }
  }, [isEditing, editingProduct])

  const ProductModal = ({ isEdit = false }: { isEdit?: boolean }) => {
    // Create local state for the form to avoid state update issues
    const [localFormData, setLocalFormData] = useState<ProductFormData>(() => ({ ...formData }))

    // Update local form when the parent formData changes (for edit mode)
    useEffect(() => {
      setLocalFormData({ ...formData })
    }, [formData])

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // Update the parent formData with our local version
      setFormData(localFormData)

      // Then submit the form
      if (isEdit) {
        handleEditProduct(e)
      } else {
        handleAddProduct(e)
      }
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{isEdit ? "Edit Product" : "Add New Product"}</h2>
            <button
              onClick={() => {
                isEdit ? setShowEditModal(false) : setShowAddModal(false)
                resetFormData()
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={localFormData.name || ""}
                  onChange={(e) => setLocalFormData({ ...localFormData, name: e.target.value })}
                  required
                  className="border p-2 mb-2 w-full"
                />
                <textarea
                  placeholder="Product Description"
                  value={localFormData.description || ""}
                  onChange={(e) => setLocalFormData({ ...localFormData, description: e.target.value })}
                  required
                  className="border p-2 mb-2 w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Selling Price"
                    value={localFormData.selling_price}
                    onChange={(e) => setLocalFormData({ ...localFormData, selling_price: e.target.value })}
                    required
                    className="border p-2 mb-2 w-full"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Product Cost"
                    value={localFormData.product_cost}
                    onChange={(e) => setLocalFormData({ ...localFormData, product_cost: e.target.value })}
                    required
                    className="border p-2 mb-2 w-full"
                  />
                </div>

                {/* Multi-select component for categories */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Categories</label>
                  <div className="border p-2 rounded-md max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={localFormData.category_ids.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLocalFormData({
                                ...localFormData,
                                category_ids: [...localFormData.category_ids, category.id],
                              })
                            } else {
                              setLocalFormData({
                                ...localFormData,
                                category_ids: localFormData.category_ids.filter((id) => id !== category.id),
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`category-${category.id}`} className="text-sm">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {categories.length === 0 && <p className="text-sm text-gray-500">No categories available</p>}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFormData.is_top_product || false}
                    onChange={(e) => setLocalFormData({ ...localFormData, is_top_product: e.target.checked })}
                  />
                  <label>Top Product</label>
                </div>
                <input
                  type="number"
                  placeholder="Priority"
                  value={localFormData.priority}
                  onChange={(e) => setLocalFormData({ ...localFormData, priority: Number(e.target.value) })}
                  className="border p-2 mb-2 w-full"
                />
              </div>
            </div>
            {/* Images Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Images</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleImageUpload(e.target.files)
                    }
                  }}
                  className="hidden"
                  id="images"
                />
                <label htmlFor="images" className="flex flex-col items-center justify-center cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload images</span>
                </label>
              </div>
              {localFormData.images && localFormData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {localFormData.images.map((url: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setLocalFormData({
                            ...localFormData,
                            images: localFormData.images.filter((_: any, i: number) => i !== index),
                          })
                        }
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  isEdit ? setShowEditModal(false) : setShowAddModal(false)
                  resetFormData()
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                {isEdit ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          {selectedProducts.length > 0 && (
            <button
              onClick={handleDeleteProducts}
              className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Selected
            </button>
          )}
          <button
            onClick={() => {
              resetFormData()
              setShowAddModal(true)
            }}
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(products.map((p) => p.id))
                      } else {
                        setSelectedProducts([])
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id])
                          } else {
                            setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 mr-3">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(product.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">${Number.parseFloat(product.selling_price.toString()).toFixed(2)}</td>
                    <td className="px-6 py-4">${Number.parseFloat(product.product_cost.toString()).toFixed(2)}</td>
                    <td className="px-6 py-4">${Number.parseFloat(product.profit_margin.toString()).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.is_locked ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.is_locked ? "Locked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleLock(product)}
                          className={`p-1.5 transition-colors ${
                            product.is_locked
                              ? "text-yellow-500 hover:bg-yellow-50"
                              : "text-green-500 hover:bg-green-50"
                          }`}
                        >
                          {product.is_locked ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(true)
                            setEditingProduct(product)
                            setShowEditModal(true)
                          }}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => toggleRowExpansion(product.id)}
                          className={`p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors ${
                            expandedRows.has(product.id) ? "bg-gray-100" : ""
                          }`}
                        >
                          <ChevronDown
                            size={18}
                            className={`transform transition-transform ${
                              expandedRows.has(product.id) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(product.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-3 gap-6">
                          {/* Statistics */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Statistics</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Engagement:</span>
                                <span className="font-medium">{product.stats?.engagement || "N/A"}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">FB Ads:</span>
                                <span className="font-medium">{product.stats?.fbAds || "N/A"}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Search Volume:</span>
                                <span className="font-medium">
                                  {product.stats?.searchVolume?.monthly?.toLocaleString() || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Orders */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Aliexpress Orders</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Daily:</span>
                                <span className="font-medium">
                                  {product.stats?.aliexpressOrders?.daily?.toLocaleString() || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Weekly:</span>
                                <span className="font-medium">
                                  {product.stats?.aliexpressOrders?.weekly?.toLocaleString() || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Monthly:</span>
                                <span className="font-medium">
                                  {product.stats?.aliexpressOrders?.monthly?.toLocaleString() || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Specifications */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Specifications</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Material:</span>
                                <span className="font-medium">{product.specifications?.material || "N/A"}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Small Size:</span>
                                <span className="font-medium">
                                  {product.specifications?.dimensions?.small || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Large Size:</span>
                                <span className="font-medium">
                                  {product.specifications?.dimensions?.large || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Categories */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Categories</h4>
                            <div className="space-y-2">
                              {product.categories && product.categories.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {product.categories.map((category) => (
                                    <span
                                      key={category.id}
                                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                      {category.name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">No categories assigned</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals for Adding and Editing Products */}
      {showAddModal && <ProductModal isEdit={false} />}
      {showEditModal && <ProductModal isEdit={true} />}
    </div>
  )
}

export default AdminProducts

