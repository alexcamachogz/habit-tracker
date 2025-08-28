import React from 'react';
import { 
  Dumbbell, 
  Sparkles, 
  BookOpen, 
  Salad,
  Activity,
  Heart,
  Brain,
  Home,
  Coffee,
  Moon,
  Sun,
  Star
} from 'lucide-react';

const iconMap = {
  'Dumbbell': Dumbbell,
  'Sparkles': Sparkles,
  'BookOpen': BookOpen,
  'Salad': Salad,
  'Activity': Activity,
  'Heart': Heart,
  'Brain': Brain,
  'Home': Home,
  'Coffee': Coffee,
  'Moon': Moon,
  'Sun': Sun,
  'Star': Star,
};

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ 
  iconName, 
  className = "w-6 h-6", 
  size 
}) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Star;
  
  if (size) {
    return <IconComponent style={{ width: size, height: size }} className={className} />;
  }
  
  return <IconComponent className={className} />;
};

export default IconRenderer;
