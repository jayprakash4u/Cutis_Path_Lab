"use client";

import React from 'react';

/**
 * Card System - Professional UI Components for LifeLine Lab
 * 
 * This file contains all reusable card components that maintain consistency
 * across the entire website. All cards follow the design system:
 * - Consistent styling and spacing
 * - Professional medical/healthcare aesthetic
 * - Smooth hover effects and transitions
 * - Responsive design for all devices
 * - Brand color palette integration
 */

// ============================================================================
// 1. BASE CARD COMPONENT
// ============================================================================
export const BaseCard = ({ 
  children, 
  className = "", 
  variant = "default",
  hover = true 
}) => {
  const variants = {
    default: "bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1",
    elevated: "bg-white border border-sky-200 shadow-md hover:shadow-xl hover:-translate-y-1",
    subtle: "bg-slate-50 border border-slate-100",
    gradient: "bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-200",
  };

  const baseStyle = "rounded-2xl p-6 transition-all duration-300";
  const hoverClass = hover ? variants[variant] : `${variants[variant].split(" hover")[0]}`;

  return (
    <div className={`${baseStyle} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

// ============================================================================
// 2. STAT CARD - For metrics, numbers, KPIs
// ============================================================================
export const StatCard = ({ 
  number, 
  label, 
  description = "", 
  icon = null,
  className = ""
}) => {
  return (
    <div className={`relative bg-white rounded-xl p-4 sm:p-5 lg:p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 border-b-2 border-b-sky-300 group cursor-pointer overflow-hidden ${className}`}>
      {/* Left accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-500 to-sky-600"></div>

      {/* Icon */}
      {icon && (
        <div className="flex justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
          <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500/10 to-sky-600/5 group-hover:from-sky-500/20 group-hover:to-sky-600/10 transition-all duration-300">
            {icon}
          </div>
        </div>
      )}

      {/* Number */}
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent mb-1 sm:mb-2">
        {number}
      </div>

      {/* Label */}
      <div className="text-sm sm:text-base font-semibold text-slate-900 mb-1 sm:mb-2">
        {label}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
          {description}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// 3. FEATURE/VALUE CARD - For company values, features, benefits
// ============================================================================
export const FeatureCard = ({ 
  title, 
  description, 
  icon = null,
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-b from-sky-500 to-sky-600 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-white ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-white/20">
            {React.cloneElement(icon, { className: "w-10 h-10 text-white" })}
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/80">
        {description}
      </p>
    </div>
  );
};

// ============================================================================
// 4. TESTIMONIAL/REVIEW CARD - For customer testimonials and reviews
// ============================================================================
export const TestimonialCard = ({ 
  content, 
  author, 
  role, 
  image = null,
  rating = 5,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-b-2 border-b-sky-300 group ${className}`}>
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? "text-amber-400" : "text-slate-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Content */}
      <p className="text-slate-600 mb-6 leading-relaxed group-hover:text-slate-700 transition-colors">
        "{content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {image && (
          <img
            src={image}
            alt={author}
            className="w-12 h-12 rounded-full object-cover border-2 border-sky-300"
          />
        )}
        <div>
          <h4 className="font-semibold text-slate-900 text-body">{author}</h4>
          <p className="text-small text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. TEAM MEMBER CARD - For team members with image and social links
// ============================================================================
export const TeamMemberCard = ({ 
  image, 
  name, 
  role, 
  description = "",
  socials = [],
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-sky-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${className}`}>
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-sky-100 to-sky-50">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name */}
        <h3 className="text-h4 text-slate-900 font-bold mb-space-sm">
          {name}
        </h3>

        {/* Role */}
        <p className="text-small text-sky-600 font-semibold mb-space-md">
          {role}
        </p>

        {/* Description */}
        {description && (
          <p className="text-small text-slate-600 mb-space-lg">
            {description}
          </p>
        )}

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="flex gap-2">
            {socials.map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                title={social.label}
                className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-sky-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-sky-600/30"
              >
                {social.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 6. INFO CARD - For contact info, address, hours (with icon on left)
// ============================================================================
export const InfoCard = ({ 
  title, 
  content, 
  icon = null,
  className = ""
}) => {
  return (
    <div className={`flex items-start gap-4 p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-body-bold text-slate-900 mb-1">
          {title}
        </h3>
        <p className="text-small text-slate-600">
          {content}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// 7. SERVICE/PACKAGE CARD - For services, packages, tests
// ============================================================================
export const ServiceCard = ({ 
  title, 
  description, 
  icon = null,
  price = null,
  badge = null,
  actionButton = null,
  actionHref = null,
  actionOnClick = null,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-sky-200 h-full flex flex-col border-t-4 border-t-sky-600 ${className}`}>
      {/* Header Strip */}
      {icon || badge ? (
        <div className="border-b border-sky-200 p-3 flex items-center justify-between">
          {icon && (
            <div className="w-10 h-10 bg-sky-600 rounded-md flex items-center justify-center text-white text-sm">
              {icon}
            </div>
          )}
          {badge && (
            <span className="inline-block px-2 py-1 text-sky-600 text-sm font-medium rounded-full border border-sky-600">
              {badge}
            </span>
          )}
        </div>
      ) : null}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-2 line-clamp-3">
            {description}
          </p>

          {/* Price */}
          {price && (
            <div className="text-sm font-bold text-sky-600 mb-2">
              {price}
            </div>
          )}
        </div>

        {/* Action Button - Bottom Right */}
        {actionButton && (
          <div className="flex justify-end mt-1">
            {actionHref ? (
              <a 
                href={actionHref}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer hover:underline transition-all duration-300 whitespace-nowrap"
              >
                {actionButton}
              </a>
            ) : (
              <button 
                onClick={actionOnClick}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer hover:underline transition-all duration-300 whitespace-nowrap bg-transparent border-none"
              >
                {actionButton}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 7B. PACKAGE CARD - Unique design for packages page (professional styling)
// ============================================================================
export const PackageCard = ({ 
  title, 
  description, 
  price = null,
  badge = null,
  image = null,
  actionHref = null,
  reportsTime = null,
  fasting = null,
  sampleType = null,
  includes = null,
  onViewDetails = null,
  className = ""
}) => {
  const handleViewDetailsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails();
    }
  };

  return ( 
    <a 
      href={actionHref}
      className={`block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Card Header */}
      <div className="bg-[#FF6B6B] px-4 py-2">
        <h3 className="text-base font-medium text-white line-clamp-1">
          {title}
        </h3>
      </div>
      
      <div className="p-4">
        {/* Badge */}
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700 mb-3">
            {badge}
          </span>
        )}

        {/* Additional Details */}
        <div className="space-y-1 mb-3 min-h-[70px]">
          {reportsTime && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Reports: {reportsTime}</span>
            </div>
          )}
          {fasting && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Fasting: {fasting}</span>
            </div>
          )}
          {sampleType && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>Sample: {sampleType}</span>
            </div>
          )}
        </div>

        {/* Includes List */}
        {includes && includes.length > 0 ? (
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-700 mb-1">Includes:</p>
            <div className="flex flex-wrap gap-1">
              {includes.slice(0, 3).map((item, index) => (
                <span key={index} className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded">
                  {item}
                </span>
              ))}
              {includes.length > 3 && (
                <span className="text-xs text-slate-500">+{includes.length - 3} more</span>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-3 min-h-[50px]"></div>
        )}
        
        {/* Price Section */}
        {price && (
          <div className="flex items-center justify-between pt-3 border-t border-sky-300">
            <span className="text-xl font-bold text-sky-600">{price}</span>
            <button 
              type="button"
              onClick={handleViewDetailsClick}
              className="text-sm font-medium text-white bg-sky-600 px-3 py-1.5 rounded-md hover:bg-sky-700 transition-colors"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </a>
  );
};

// ============================================================================
// 7C. SERVICE CARD WITH IMAGE - For services page (left circle with gradient + right content)
// ============================================================================
export const ServiceCardWithImage = ({ 
  title, 
  description, 
  imageUrl = null,
  icon = null,
  actionButton = null,
  actionOnClick = null,
  reportsTime = null,
  fasting = null,
  sampleType = null,
  className = ""
}) => {
  return (
    <div 
      onClick={actionOnClick}
      className={`block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Card Header */}
      <div className="bg-[#FF6B6B] px-4 py-2">
        <h3 className="text-base font-medium text-white line-clamp-1">
          {title}
        </h3>
      </div>

      <div className="p-4">
        <div className="flex items-start">
          {/* Image - Left Side */}
          <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden shadow-md mr-4">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : icon ? (
              <div className="w-full h-full flex items-center justify-center bg-sky-500">
                <div className="text-2xl text-white">{icon}</div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sky-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content - Right Side */}
          <div className="flex-1">
            {description && (
              <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-1 mt-2">
          {reportsTime && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Reports: {reportsTime}</span>
            </div>
          )}
          {fasting && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Fasting: {fasting}</span>
            </div>
          )}
          {sampleType && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>Sample: {sampleType}</span>
            </div>
          )}
        </div>
        
        {/* Line below image */}
        <div className="border-t border-sky-400 mt-3"></div>
        
        {actionButton && (
          <div className="flex justify-end mt-2">
            <span className="px-4 py-1.5 rounded-md bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold shadow-md">
              {actionButton}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 8. LIST ITEM CARD - For lists with icons (values, benefits)
// ============================================================================
export const ListItemCard = ({ 
  title, 
  description = "",
  icon = null,
  className = ""
}) => {
  return (
    <div className={`flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-sky-50 hover:border-sky-200 transition-all duration-300 ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0 text-sky-600">
          {icon}
        </div>
      )}

      {/* Content */}
      <div>
        <p className="text-small-bold text-slate-900">
          {title}
        </p>
        {description && (
          <p className="text-small text-slate-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 9. ACHIEVEMENT/MILESTONE CARD - For achievements, certifications
// ============================================================================
export const AchievementCard = ({ 
  icon, 
  title, 
  description = "",
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-sky-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${className}`}>
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-sky-500 to-sky-600"></div>

      {/* Content */}
      <div className="p-6 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-h4 text-slate-900 font-bold mb-space-sm">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-small text-slate-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 10. FORM CARD - For forms and input sections
// ============================================================================
export const FormCard = ({ 
  title, 
  description = "",
  children,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 shadow-sm ${className}`}>
      {/* Header */}
      <div className="mb-space-lg">
        {title && (
          <h2 className="text-h2 text-slate-900 font-bold mb-space-md">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-body text-slate-600">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

// ============================================================================
// 11. EMPTY STATE CARD - For empty states, no data messages
// ============================================================================
export const EmptyStateCard = ({ 
  icon, 
  title, 
  message,
  actionButton = null,
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-8 border border-sky-200 text-center ${className}`}>
      {/* Icon */}
      <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-h2 text-slate-900 font-bold mb-space-md">
        {title}
      </h3>

      {/* Message */}
      <p className="text-body text-slate-600 mb-space-lg">
        {message}
      </p>

      {/* Action Button */}
      {actionButton && (
        <button className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors">
          {actionButton}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// 12. EXPANDABLE CARD - For FAQ, accordion items
// ============================================================================
export const ExpandableCard = ({ 
  title, 
  content,
  isOpen = false,
  onToggle = () => {},
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-sky-300 transition-all duration-300 ${className}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <h3 className="text-body-bold text-slate-900">
          {title}
        </h3>
        <svg
          className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <p className="text-small text-slate-600">
            {content}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 13. LIKE CARD - For tests/packages with like functionality
// ============================================================================
export const LikeCard = ({ 
  title, 
  category,
  price,
  originalPrice = null,
  description = "",
  icon = null,
  isLiked = false,
  onLikeToggle = () => {},
  onBookClick = null,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${className}`}>
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-sky-50 to-sky-100/50 p-5 border-b border-sky-200">
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onLikeToggle();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10"
        >
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${
              isLiked ? "text-red-500 fill-red-500" : "text-slate-400 hover:text-red-400"
            }`}
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Icon */}
        {icon && (
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
          </div>
        )}

        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-sky-600 text-white text-tiny font-medium rounded-full">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-h4 text-slate-900 font-bold mb-2 line-clamp-2 group-hover:text-sky-700 transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-small text-slate-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-h3 font-bold text-sky-600">
            ₹{price}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-small text-slate-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Book Button */}
        {onBookClick && (
          <button
            onClick={onBookClick}
            className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-600/30"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
};
