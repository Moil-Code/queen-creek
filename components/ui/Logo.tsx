import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const QC_CHAMBER_LOGO_URL = '/logo.png';

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className,
  showText = true 
}) => {
  const sizeClasses = {
    sm: {
      container: 'h-8',
      width: 100,
      height: 32,
    },
    md: {
      container: 'h-10',
      width: 125,
      height: 40,
    },
    lg: {
      container: 'h-14',
      width: 175,
      height: 56,
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src={QC_CHAMBER_LOGO_URL}
        alt="Queen Creek Chamber Logo"
        width={sizes.width}
        height={sizes.height}
        className={cn(sizes.container, 'object-contain')}
        priority
      />
    </div>
  );
};

export default Logo;
