import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  ChevronDown,
  Lock,
  Unlock,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

// ----------------------------
// Type Definitions
// ----------------------------

interface Product {
  id: string;
  name: string;
  description: string;
  selling_price: number;
  product_cost: number;
  profit_margin: number;
  is_locked: boolean;
  images: string[];
  created_at: string;
  stats: any; // Customize as needed
  specifications: any; // Customize as needed
  // ...other fields if necessary
}

// ----------------------------
// API Functions (CRUD)
// ----------------------------

/**
 * Fetch all products from the database.
 * Returns products sorted by creation date (descending).
 */
const fetchProductsAPI = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

/**
 * Create a new product.
 * @param productData - The data for the new product.
 * @returns The newly created product.
 */
const createProductAPI = async (
  productData: Partial<Product>
): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select();
    if (error) throw error;
    return data && data[0];
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};

/**
 * Update an existing product.
 * @param id - The ID of the product to update.
 * @param productData - The updated product data.
 * @returns The updated product.
 */
const updateProductAPI = async (
  id: string,
  productData: Partial<Product>
): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data && data[0];
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};

/**
 * Delete a product.
 * @param id - The ID of the product to delete.
 * @returns Boolean indicating success.
 */
const deleteProductAPI = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

/**
 * Bulk delete products.
 * @param ids - Array of product IDs to delete.
 * @returns Boolean indicating success.
 */
const deleteMultipleProductsAPI = async (ids: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", ids);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting multiple products:", error);
    return false;
  }
};

/**
 * Toggle the lock status of a product.
 * @param product - The product whose lock status should be toggled.
 * @returns The updated product.
 */
const toggleLockAPI = async (product: Product): Promise<Product | null> => {
  try {
    const updatedLockStatus = !product.is_locked;
    const { data, error } = await supabase
      .from("products")
      .update({ is_locked: updatedLockStatus })
      .eq("id", product.id)
      .select();
    if (error) throw error;
    return data && data[0];
  } catch (error) {
    console.error("Error toggling lock status:", error);
    return null;
  }
};

// ----------------------------
// AdminProducts Component
// ----------------------------

const AdminProducts: React.FC = () => {
  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Local state for modal form
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    selling_price: "",
    product_cost: "",
    is_locked: true,
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
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // ----------------------------
  // Data Fetching
  // ----------------------------

  // Fetch products when component mounts
  useEffect(() => {
    (async () => {
      const productsData = await fetchProductsAPI();
      setProducts(productsData);
      setLoading(false);
    })();
  }, []);

  // ----------------------------
  // CRUD Handlers
  // ----------------------------

  /**
   * Handle bulk deletion of selected products.
   */
  const handleDeleteProducts = async () => {
    if (!window.confirm("Are you sure you want to delete the selected products?")) return;
    const success = await deleteMultipleProductsAPI(selectedProducts);
    if (success) {
      setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    }
  };

  /**
   * Handle deletion of a single product.
   * @param id - The ID of the product to delete.
   */
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const success = await deleteProductAPI(id);
    if (success) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  /**
   * Toggle the lock status of a product.
   * @param product - The product to toggle.
   */
  const toggleLock = async (product: Product) => {
    const updatedProduct = await toggleLockAPI(product);
    if (updatedProduct) {
      setProducts(products.map((p) => (p.id === product.id ? updatedProduct : p)));
    }
  };

  /**
   * Toggle the expansion of a product row to show extra details.
   * @param productId - The product ID to expand/collapse.
   */
  const toggleRowExpansion = (productId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });
  };

  // ----------------------------
  // Modal Form Handlers
  // ----------------------------

  /**
   * Reset the modal form to its initial state.
   */
  const resetFormData = () => {
    setFormData({
      name: "",
      description: "",
      selling_price: "",
      product_cost: "",
      is_locked: true,
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
    });
    setIsEditing(false);
    setEditingProduct(null);
  };

  /**
   * Handle submission of the add product form.
   */
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = await createProductAPI(formData);
    if (newProduct) {
      setProducts([newProduct, ...products]);
      resetFormData();
      setShowAddModal(false);
    }
  };

  /**
   * Handle submission of the edit product form.
   */
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = await updateProductAPI(editingProduct.id, formData);
    if (updated) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)));
      resetFormData();
      setShowEditModal(false);
    }
  };

  /**
   * Handle image upload and update form data with image URLs.
   * @param files - The files to upload.
   */
  const handleImageUpload = async (files: FileList) => {
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`; //folder-name, file

        const { error: uploadError } = await supabase.storage
          .from("productImages") //bucket name
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("productImages").getPublicUrl(filePath);
        if (data?.publicUrl) {
          urls.push(data.publicUrl);
        }
      }
      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // ----------------------------
  // Modal Component for Add/Edit
  // ----------------------------

  const ProductModal = ({ isEdit = false }: { isEdit?: boolean }) => {
    // If in edit mode, initialize form data from the product to be edited
    useEffect(() => {
      if (isEdit && editingProduct) {
        setFormData({
          name: editingProduct.name,
          description: editingProduct.description,
          selling_price: editingProduct.selling_price,
          product_cost: editingProduct.product_cost,
          is_locked: editingProduct.is_locked,
          images: editingProduct.images || [],
          stats: editingProduct.stats || formData.stats,
          specifications: editingProduct.specifications || formData.specifications,
        });
      }
    }, [isEdit, editingProduct]);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={() => {
                isEdit ? setShowEditModal(false) : setShowAddModal(false);
                resetFormData();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <form onSubmit={isEdit ? handleEditProduct : handleAddProduct} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="border p-2 mb-2 w-full"
                />
                <textarea
                  placeholder="Product Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="border p-2 mb-2 w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Selling Price"
                    value={formData.selling_price}
                    onChange={(e) =>
                      setFormData({ ...formData, selling_price: e.target.value })
                    }
                    required
                    className="border p-2 mb-2 w-full"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Product Cost"
                    value={formData.product_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, product_cost: e.target.value })
                    }
                    required
                    className="border p-2 mb-2 w-full"
                  />
                </div>
                <div>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="border p-2 mb-2 w-full"
                  >
                    <option value="">Select Category</option>
                    {/* Add your category options here or pass them as props */}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_top_product || false}
                    onChange={(e) =>
                      setFormData({ ...formData, is_top_product: e.target.checked })
                    }
                  />
                  <label>Top Product</label>
                </div>
                <input
                  type="number"
                  placeholder="Priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: Number(e.target.value) })
                  }
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
                  onChange={(e) =>
                    e.target.files && handleImageUpload(e.target.files)
                  }
                  className="hidden"
                  id="images"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Click to upload images
                  </span>
                </label>
              </div>
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {formData.images.map((url: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_: any, i: number) => i !== index),
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
                  isEdit ? setShowEditModal(false) : setShowAddModal(false);
                  resetFormData();
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
    );
  };

  // ----------------------------
  // Render Component UI
  // ----------------------------

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
              resetFormData();
              setShowAddModal(true);
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
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
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
                        setSelectedProducts(products.map((p) => p.id));
                      } else {
                        setSelectedProducts([]);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
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
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter((id) => id !== product.id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 mr-3">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
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
                    <td className="px-6 py-4">
                      ${parseFloat(product.selling_price.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      ${parseFloat(product.product_cost.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      ${parseFloat(product.profit_margin.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.is_locked
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
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
                            setIsEditing(true);
                            setEditingProduct(product);
                            setShowEditModal(true);
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
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Statistics
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Engagement:</span>
                                <span className="font-medium">
                                  {product.stats?.engagement || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">FB Ads:</span>
                                <span className="font-medium">
                                  {product.stats?.fbAds || "N/A"}
                                </span>
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
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Aliexpress Orders
                            </h4>
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
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Specifications
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Material:</span>
                                <span className="font-medium">
                                  {product.specifications?.material || "N/A"}
                                </span>
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
  );
};

export default AdminProducts;




// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Search,
//   Filter,
//   MoreVertical,
//   Trash2,
//   Edit,
//   Eye,
//   Image as ImageIcon,
//   BarChart2,
//   DollarSign,
//   MessageSquare,
//   Link as LinkIcon,
//   Facebook,
//   Play,
//   Target,
//   Tag,
//   ChevronDown,
//   Lock,
//   Unlock,
//   Save,
//   X,
// } from "lucide-react";
// import { supabase } from "../../lib/supabase";

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   selling_price: number;
//   product_cost: number;
//   profit_margin: number;
//   is_locked: boolean;
//   images: string[];
//   created_at: string;
//   stats: {
//     engagement?: string;
//     fbAds?: string;
//     targetingInfo?: string;
//     searchVolume?: {
//       monthly: number;
//       trend: string;
//       relatedTerms: Array<{ term: string; volume: number }>;
//     };
//     aliexpressOrders?: {
//       daily: number;
//       weekly: number;
//       monthly: number;
//       trend: string;
//     };
//   };
//   specifications: {
//     material?: string;
//     dimensions?: {
//       small?: string;
//       large?: string;
//     };
//     [key: string]: any;
//   };
// }

// const AdminProducts = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [isEditing, setIsEditing] = useState<any>();
//   const [productToEdit, setProductToEdit] = useState<any>();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setProducts(data || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProducts = async () => {
//     if (
//       !window.confirm("Are you sure you want to delete the selected products?")
//     )
//       return;

//     try {
//       const { error } = await supabase
//         .from("products")
//         .delete()
//         .in("id", selectedProducts);

//       if (error) throw error;

//       setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
//       setSelectedProducts([]);
//     } catch (error) {
//       console.error("Error deleting products:", error);
//     }
//   };

//   const toggleRowExpansion = (productId: string) => {
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       if (next.has(productId)) {
//         next.delete(productId);
//       } else {
//         next.add(productId);
//       }
//       return next;
//     });
//   };

//   const toggleLock = async (product: Product) => {
//     try {
//       const { error } = await supabase
//         .from("products")
//         .update({ is_locked: !product.is_locked })
//         .eq("id", product.id);

//       if (error) throw error;

//       setProducts(
//         products.map((p) =>
//           p.id === product.id ? { ...p, is_locked: !p.is_locked } : p
//         )
//       );
//     } catch (error) {
//       console.error("Error toggling product lock status:", error);
//     }
//   };

//   const ProductModal = ({ isEdit = false }) => {
//     const [formData, setFormData] = useState({
//       name: "",
//       description: "",
//       selling_price: "",
//       product_cost: "",
//       is_locked: true,
//       images: [] as string[],
//       stats: {
//         engagement: "Medium",
//         fbAds: "Active",
//         targetingInfo: "Available",
//         searchVolume: {
//           monthly: 0,
//           trend: "increasing",
//           relatedTerms: [],
//         },
//         aliexpressOrders: {
//           daily: 0,
//           weekly: 0,
//           monthly: 0,
//           trend: "increasing",
//         },
//       },
//       specifications: {
//         material: "",
//         dimensions: {
//           small: "",
//           large: "",
//         },
//       },
//     });

//     const handleImageUpload = async (files: FileList) => {
//       try {
//         const urls = [];
//         for (const file of Array.from(files)) {
//           const fileExt = file.name.split(".").pop();
//           const fileName = `${Math.random()}.${fileExt}`;
//           const filePath = `product-images/${fileName}`;

//           const { error: uploadError } = await supabase.storage
//             .from("productImages")
//             .upload(filePath, file);

//           if (uploadError) throw uploadError;

//           const {
//             data: { publicUrl },
//           } = supabase.storage.from("productImages").getPublicUrl(filePath);

//           urls.push(publicUrl);
//         }

//         setFormData((prev) => ({
//           ...prev,
//           images: [...prev.images, ...urls],
//         }));
//       } catch (error) {
//         console.error("Error uploading images:", error);
//       }
//     };
    
//     useEffect(() => {
//       if (isEditing) {
//         startEdit(productToEdit);
//       }
//     }, [isEditing]);

//     const startEdit = (product: Product) => {
//       setEditingProduct(product);
//       setFormData({
//         ...product,
//         selling_price: product.selling_price.toString() ?? 0,
//         product_cost: product.product_cost.toString() ?? 0,
//         stats: product.stats || formData.stats || {},
//         specifications: product.specifications || formData.specifications ||{},
//       });
//       setShowEditModal(true);
//     };

//     const resetFormData = () => {
//       setFormData({
//         name: "",
//         description: "",
//         selling_price: "",
//         product_cost: "",
//         is_locked: true,
//         images: [],
//         stats: {
//           engagement: "Medium",
//           fbAds: "Active",
//           targetingInfo: "Available",
//           searchVolume: {
//             monthly: 0,
//             trend: "increasing",
//             relatedTerms: [],
//           },
//           aliexpressOrders: {
//             daily: 0,
//             weekly: 0,
//             monthly: 0,
//             trend: "increasing",
//           },
//         },
//         specifications: {
//           material: "",
//           dimensions: {
//             small: "",
//             large: "",
//           },
//         },
//       });
//     };

//     const handleAddProduct = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setIsEditing(false);
//       try {
//         const { data, error } = await supabase
//           .from("products")
//           .insert([
//             {
//               ...formData,
//               selling_price: parseFloat(formData.selling_price),
//               product_cost: parseFloat(formData.product_cost),
//             },
//           ])
//           .select();

//         if (error) throw error;

//         setProducts([...(data || []), ...products]);
//         setShowAddModal(false);
//         resetFormData();
//       } catch (error) {
//         console.error("Error adding product:", error);
//       }
//     };

//     const handleEditProduct = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setIsEditing(false);
//       if (!editingProduct) return;

//       try {
//         const { profit_margin, ...updateData } = {
//           ...formData,
//           selling_price: parseFloat(formData.selling_price),
//           product_cost: parseFloat(formData.product_cost),
//         };

//         const { error } = await supabase
//           .from("products")
//           .update(updateData)
//           .eq("id", editingProduct.id);

//         if (error) throw error;

//         setProducts(
//           products.map((p) =>
//             p.id === editingProduct.id ? { ...p, ...updateData } : p
//           )
//         );
//         setShowEditModal(false);
//         setEditingProduct(null);
//         resetFormData();
//       } catch (error) {
//         console.error("Error updating product:", error);
//       }
//     };

//     console.log(formData?.images);
//     return (
//       <div
//         key={"modal"}
//         className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//       >
//         <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold">
//               {isEdit ? "Edit Product" : "Add New Product"}
//             </h2>
//             <button
//               onClick={() =>
//                 isEdit ? setShowEditModal(false) : setShowAddModal(false)
//               }
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <X size={20} className="text-gray-500" />
//             </button>
//           </div>

//           <form
//             onSubmit={isEdit ? handleEditProduct : handleAddProduct}
//             className="space-y-6"
//           >
//             {/* Basic Information */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h3 className="text-lg font-medium mb-4">Basic Information</h3>
//               <div className="grid grid-cols-1 gap-4">
//                 <input
//                   type="text"
//                   value={formData?.name}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, name: e.target.value }))
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   required
//                 />

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={formData?.description}
//                     onChange={(e) =>
//                       setFormData({ ...formData, description: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                     rows={3}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Selling Price
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={formData?.selling_price}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           selling_price: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Product Cost
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={formData?.product_cost}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           product_cost: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Images */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h3 className="text-lg font-medium mb-4">Images</h3>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={(e) =>
//                     e.target.files && handleImageUpload(e.target.files)
//                   }
//                   className="hidden"
//                   id="images"
//                 />
//                 <label
//                   htmlFor="images"
//                   className="flex flex-col items-center justify-center cursor-pointer"
//                 >
//                   <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
//                   <span className="text-sm text-gray-500">
//                     Click to upload images
//                   </span>
//                 </label>
//               </div>
//               {formData?.images?.length > 0 && (
//                 <div className="mt-4 grid grid-cols-4 gap-4">
//                   {formData.images.map((url, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={url}
//                         alt={`Preview ${index + 1}`}
//                         className="h-24 w-full object-cover rounded-lg"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setFormData({
//                             ...formData,
//                             images: formData.images.filter(
//                               (_, i) => i !== index
//                             ),
//                           })
//                         }
//                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X size={14} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Statistics */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h3 className="text-lg font-medium mb-4">Statistics</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Engagement Level
//                   </label>
//                   <select
//                     value={formData?.stats.engagement}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         stats: {
//                           ...formData?.stats,
//                           engagement: e.target.value,
//                         },
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   >
//                     <option value="Low">Low</option>
//                     <option value="Medium">Medium</option>
//                     <option value="High">High</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Facebook Ads Status
//                   </label>
//                   <select
//                     value={formData?.stats?.fbAds}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         stats: { ...formData?.stats, fbAds: e.target.value },
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                     <option value="Pending">Pending</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Monthly Search Volume
//                   </label>
//                   <input
//                     type="number"
//                     value={formData?.stats?.searchVolume?.monthly}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         stats: {
//                           ...formData?.stats,
//                           searchVolume: {
//                             ...formData?.stats?.searchVolume,
//                             monthly: parseInt(e.target.value),
//                           },
//                         },
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Search Trend
//                   </label>
//                   <select
//                     value={formData?.stats?.searchVolume?.trend}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         stats: {
//                           ...formData?.stats,
//                           searchVolume: {
//                             ...formData?.stats?.searchVolume,
//                             trend: e.target.value,
//                           },
//                         },
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   >
//                     <option value="increasing">Increasing</option>
//                     <option value="stable">Stable</option>
//                     <option value="decreasing">Decreasing</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">
//                   Aliexpress Orders
//                 </h4>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">
//                       Daily
//                     </label>
//                     <input
//                       type="number"
//                       value={formData?.stats?.aliexpressOrders?.daily}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           stats: {
//                             ...formData?.stats,
//                             aliexpressOrders: {
//                               ...formData?.stats?.aliexpressOrders,
//                               daily: parseInt(e.target.value),
//                             },
//                           },
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">
//                       Weekly
//                     </label>
//                     <input
//                       type="number"
//                       value={formData?.stats?.aliexpressOrders?.weekly}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           stats: {
//                             ...formData?.stats,
//                             aliexpressOrders: {
//                               ...formData?.stats?.aliexpressOrders,
//                               weekly: parseInt(e.target.value),
//                             },
//                           },
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">
//                       Monthly
//                     </label>
//                     <input
//                       type="number"
//                       value={formData?.stats?.aliexpressOrders?.monthly}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           stats: {
//                             ...formData?.stats,
//                             aliexpressOrders: {
//                               ...formData?.stats?.aliexpressOrders,
//                               monthly: parseInt(e.target.value),
//                             },
//                           },
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Specifications */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h3 className="text-lg font-medium mb-4">Specifications</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Material
//                   </label>
//                   <input
//                     type="text"
//                     value={formData?.specifications?.material}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         specifications: {
//                           ...formData?.specifications,
//                           material: e.target.value,
//                         },
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Dimensions
//                   </label>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1">
//                         Small Size
//                       </label>
//                       <input
//                         type="text"
//                         value={formData?.specifications?.dimensions?.small}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             specifications: {
//                               ...formData?.specifications,
//                               dimensions: {
//                                 ...formData?.specifications?.dimensions,
//                                 small: e.target.value,
//                               },
//                             },
//                           })
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                         placeholder="e.g., 10x5x2 cm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1">
//                         Large Size
//                       </label>
//                       <input
//                         type="text"
//                         value={formData?.specifications?.dimensions?.large}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             specifications: {
//                               ...formData?.specifications,
//                               dimensions: {
//                                 ...formData?.specifications?.dimensions,
//                                 large: e.target.value,
//                               },
//                             },
//                           })
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                         placeholder="e.g., 15x8x3 cm"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Lock Status */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="is_locked"
//                   checked={formData?.is_locked}
//                   onChange={(e) =>
//                     setFormData({ ...formData, is_locked: e.target.checked })
//                   }
//                   className="rounded border-gray-300 text-primary focus:ring-primary"
//                 />
//                 <label htmlFor="is_locked" className="text-sm text-gray-700">
//                   Lock this product (only available to pro users)
//                 </label>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => {
//                   isEdit ? setShowEditModal(false) : setShowAddModal(false);
//                   setIsEditing(false);
//                 }}
//                 className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
//               >
//                 <Save size={18} />
//                 {isEdit ? "Save Changes" : "Add Product"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Products</h1>
//           <p className="text-gray-600">Manage your product catalog</p>
//         </div>
//         <div className="flex gap-2">
//           {selectedProducts.length > 0 && (
//             <button
//               onClick={handleDeleteProducts}
//               className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//             >
//               <Trash2 className="h-5 w-5 mr-2" />
//               Delete Selected
//             </button>
//           )}
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Add Product
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <div className="relative flex-1">
//           <Search
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             size={20}
//           />
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//         </div>
//         <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
//           <Filter className="h-5 w-5 mr-2" />
//           Filters
//         </button>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="px-6 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     className="rounded border-gray-300 text-primary focus:ring-primary"
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedProducts(products.map((p) => p.id));
//                       } else {
//                         setSelectedProducts([]);
//                       }
//                     }}
//                   />
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Cost
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Margin
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {products.map((product) => (
//                 <React.Fragment key={product.id}>
//                   <tr className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         className="rounded border-gray-300 text-primary focus:ring-primary"
//                         checked={selectedProducts.includes(product.id)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setSelectedProducts([
//                               ...selectedProducts,
//                               product.id,
//                             ]);
//                           } else {
//                             setSelectedProducts(
//                               selectedProducts.filter((id) => id !== product.id)
//                             );
//                           }
//                         }}
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 rounded-lg bg-gray-100 mr-3">
//                           {product.images?.[0] && (
//                             <img
//                               src={product.images[0]}
//                               alt={product.name}
//                               className="h-10 w-10 rounded-lg object-cover"
//                             />
//                           )}
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {product.name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {new Date(product.created_at).toLocaleDateString()}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       ${product.selling_price.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       ${product.product_cost.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       ${product.profit_margin.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           product.is_locked
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {product.is_locked ? "Locked" : "Active"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={() => toggleLock(product)}
//                           className={`p-1.5 rounde d-lg transition-colors ${
//                             product.is_locked
//                               ? "text-yellow-500 hover:bg-yellow-50"
//                               : "text-green-500 hover:bg-green-50"
//                           }`}
//                         >
//                           {product.is_locked ? (
//                             <Lock size={18} />
//                           ) : (
//                             <Unlock size={18} />
//                           )}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setIsEditing(true);
//                             setProductToEdit(product);
//                             setShowEditModal(true);
//                           }}
//                           className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
//                         >
//                           <Edit size={18} />
//                         </button>
//                         <button
//                           onClick={() => toggleRowExpansion(product.id)}
//                           className={`p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors ${
//                             expandedRows.has(product.id) ? "bg-gray-100" : ""
//                           }`}
//                         >
//                           <ChevronDown
//                             size={18}
//                             className={`transform transition-transform ${
//                               expandedRows.has(product.id) ? "rotate-180" : ""
//                             }`}
//                           />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                   {expandedRows.has(product.id) && (
//                     <tr className="bg-gray-50">
//                       <td colSpan={7} className="px-6 py-4">
//                         <div className="grid grid-cols-3 gap-6">
//                           {/* Stats */}
//                           <div>
//                             <h4 className="text-sm font-medium text-gray-900 mb-2">
//                               Statistics
//                             </h4>
//                             <div className="space-y-2">
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">
//                                   Engagement:
//                                 </span>
//                                 <span className="font-medium">
//                                   {product.stats?.engagement || "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">FB Ads:</span>
//                                 <span className="font-medium">
//                                   {product.stats?.fbAds || "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">
//                                   Search Volume:
//                                 </span>
//                                 <span className="font-medium">
//                                   {product.stats?.searchVolume?.monthly?.toLocaleString() ||
//                                     "N/A"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Orders */}
//                           <div>
//                             <h4 className="text-sm font-medium text-gray-900 mb-2">
//                               Aliexpress Orders
//                             </h4>
//                             <div className="space-y-2">
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">Daily:</span>
//                                 <span className="font-medium">
//                                   {product.stats?.aliexpressOrders?.daily?.toLocaleString() ||
//                                     "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">Weekly:</span>
//                                 <span className="font-medium">
//                                   {product.stats?.aliexpressOrders?.weekly?.toLocaleString() ||
//                                     "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">Monthly:</span>
//                                 <span className="font-medium">
//                                   {product.stats?.aliexpressOrders?.monthly?.toLocaleString() ||
//                                     "N/A"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Specifications */}
//                           <div>
//                             <h4 className="text-sm font-medium text-gray-900 mb-2">
//                               Specifications
//                             </h4>
//                             <div className="space-y-2">
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">Material:</span>
//                                 <span className="font-medium">
//                                   {product.specifications?.material || "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">
//                                   Small Size:
//                                 </span>
//                                 <span className="font-medium">
//                                   {product.specifications?.dimensions?.small ||
//                                     "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">
//                                   Large Size:
//                                 </span>
//                                 <span className="font-medium">
//                                   {product.specifications?.dimensions?.large ||
//                                     "N/A"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add/Edit Product Modal */}
//       {showAddModal && <ProductModal />}
//       {showEditModal && <ProductModal isEdit />}
//     </div>
//   );
// };

// export default AdminProducts;
