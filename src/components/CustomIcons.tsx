import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// 1. Home Icon (Squircle house with rounded roof & smile curve)
export function CustomHomeIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 11.5 C4 9.5, 5 7.5, 12 3 C19 7.5, 20 9.5, 20 11.5 V18 C20 20, 19 21, 17 21 H7 C5 21, 4 20, 4 18 Z" />
      <path d="M10 16.5 C11 17.5, 13 17.5, 14 16.5" />
    </svg>
  );
}

// 2. Bell Icon (Thick rounded bell outline with clapper)
export function CustomBellIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 16 C6 14, 5 11, 7 7 C8.5 4, 15.5 4, 17 7 C19 11, 18 14, 18 16 H6 Z" />
      <path d="M6 16 H18 C19 16, 20 17, 19 18 H5 C4 17, 5 16, 6 16 Z" />
      <path d="M10 19.5 C10.5 21, 13.5 21, 14 19.5" />
    </svg>
  );
}

// 3. Calendar Icon (Rounded box with top rings & grid dots)
export function CustomCalendarIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="5" width="16" height="15" rx="4" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="8" y1="3" x2="8" y2="6" />
      <line x1="16" y1="3" x2="16" y2="6" />
      <circle cx="8.5" cy="13.5" r="0.75" fill={color} />
      <circle cx="12" cy="13.5" r="0.75" fill={color} />
      <circle cx="15.5" cy="13.5" r="0.75" fill={color} />
      <circle cx="8.5" cy="17" r="0.75" fill={color} />
      <circle cx="12" cy="17" r="0.75" fill={color} />
      <circle cx="15.5" cy="17" r="0.75" fill={color} />
    </svg>
  );
}

// 4. Lightbulb Icon (Thick rounded bulb outline)
export function CustomLightbulbIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a7 7 0 0 0-7 7c0 2.5 1.3 4.7 3.3 6h7.4c2-1.3 3.3-3.5 3.3-6a7 7 0 0 0-7-7z" />
      <line x1="12" y1="10" x2="12" y2="14" />
    </svg>
  );
}

// 5. Chart Icon (Thick L-axis with wave curve & dotted line)
export function CustomChartIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4v14c0 1.1.9 2 2 2h14" />
      <path d="M6 14c4-6 6 4 10-4 2 2 3 1 4 0" />
      <line x1="6" y1="12" x2="20" y2="12" strokeDasharray="2 3" />
    </svg>
  );
}

// 6. Chat Bubble Icon (Rounded speech bubble with 2 dash lines)
export function CustomChatIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 12c0 4.4-3.6 8-8 8-1.5 0-2.9-.4-4.1-1.1L4 20l1.1-3.9C4.4 14.9 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  );
}

// 7. Settings Cog Icon (Rounded gear with center loop)
export function CustomSettingsIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// 8. Checklist Icon (Square with rounded checkmark)
export function CustomChecklistIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M8.5 12.5 L11 15 L15.5 9.5" />
    </svg>
  );
}

// 9. Notification Card Icon (Rounded card with top-right notification dot)
export function CustomNotificationIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="5" width="16" height="15" rx="4" />
      <line x1="8" y1="12" x2="14" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
      <circle cx="18" cy="6" r="3" fill={color} />
    </svg>
  );
}

// 10. Stacked Menu Icon (Rounded stacked cards)
export function CustomMenuIcon({ size = 24, color = "currentColor", strokeWidth = 2.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="4" width="12" height="16" rx="3" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
      <path d="M4 7v10" />
      <path d="M20 7v10" />
    </svg>
  );
}

// 11. Official Discord Logo SVG Icon
export function DiscordLogoIcon({ size = 18, color = "#5865F2" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 127.14 96.36" fill={color}>
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.91-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53S36,40.3,42.45,40.3C48.83,40.3,54,46,53.86,53,53.86,60,48.83,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.07-12.7,11.44-12.7C91.08,40.3,96.24,46,96.1,53,96.1,60,91.08,65.69,84.69,65.69Z"/>
    </svg>
  );
}

// 12. Official LATAM COMPANY Brand Logo Component
export function LatamCompanyBrandLogo({ 
  size = 38, 
  isCollapsed = false,
  isDark
}: { 
  size?: number; 
  isCollapsed?: boolean;
  isDark?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div style={{ width: size, height: size }} className="flex items-center justify-center shrink-0">
        {isDark !== undefined ? (
          <img 
            src={isDark ? "/logo-dark.png" : "/logo-light.png"} 
            alt="LATAM COMPANY Logo" 
            className="w-full h-full object-contain drop-shadow-sm"
          />
        ) : (
          <>
            <img 
              src="/logo-light.png" 
              alt="LATAM COMPANY Logo" 
              className="w-full h-full object-contain block dark:hidden drop-shadow-sm"
            />
            <img 
              src="/logo-dark.png" 
              alt="LATAM COMPANY Logo" 
              className="w-full h-full object-contain hidden dark:block drop-shadow-sm"
            />
          </>
        )}
      </div>

      {!isCollapsed && (
        <div className="flex items-baseline font-black tracking-wider text-base leading-none font-sans">
          <span className="text-[#294C74] dark:text-white uppercase font-black">LATAM</span>
          <span className="text-[#F17633] uppercase font-black ml-1.5">COMPANY</span>
        </div>
      )}
    </div>
  );
}
