import React from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Ecomhunt University',
    subtitle: 'BASIC',
    description: "The new and improved University that covers the basics of the Dropshipping world and much more than that.",
    details: "We'll introduce you to this amazing business model that's called Dropshipping, and show its hidden potential.",
    additionalInfo: "Once you're done with the University, your next move will be to check out our Masterclass course to move into the Pro league.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    thumbnail: "https://i.postimg.cc/QxLkYX3X/Ecom-Degen-Logo.png"
  },
  // ... rest of the courses array
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 animate-fade-in">
            <GraduationCap size={32} className="text-primary animate-bounce-subtle" />
            <h1 className="text-3xl font-bold text-gray-900">WinProd Courses</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <div 
              key={course.id} 
              className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg hover:border-primary/20 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Course Header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 group-hover:bg-gray-100/80 transition-colors duration-300">
                <span className={`px-2 py-0.5 text-xs font-bold rounded transform group-hover:scale-105 transition-transform duration-300 ${
                  course.subtitle.includes('PRO') 
                    ? 'bg-[#FFD700] text-black'
                    : course.subtitle.includes('SUITE')
                    ? 'bg-purple-500 text-white'
                    : 'bg-yellow-500 text-black'
                }`}>
                  {course.subtitle}
                </span>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">{course.title}</h2>
              </div>

              {/* Course Content */}
              <div className="p-4 space-y-4">
                {course.description && (
                  <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{course.description}</p>
                )}
                
                {course.thumbnail && (
                  <div className="relative h-48 bg-gray-50 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow duration-300">
                    <img 
                      src={course.thumbnail}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {course.details && (
                  <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{course.details}</p>
                )}

                {course.additionalInfo && (
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">{course.additionalInfo}</p>
                )}

                {/* Action Button */}
                <button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md">
                  Upgrade to access 
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;