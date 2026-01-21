/**
 * Icon Registry - Pre-imported icons for fast, consistent usage
 *
 * Usage:
 *   import { Icons } from '@/components/icons';
 *   <Icons.home className="h-5 w-5" />
 *
 * All icons are from lucide-react, sized consistently at the usage site.
 * Standard sizes: h-4 w-4 (small), h-5 w-5 (default), h-6 w-6 (large)
 */

import {
  // Navigation & UI
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  MoreHorizontal,
  MoreVertical,

  // Actions
  Plus,
  Minus,
  Check,
  Copy,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
  Share,
  Send,
  RefreshCw,
  RotateCcw,

  // Status & Feedback
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,

  // Content
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,

  // User & Auth
  User,
  Users,
  UserPlus,
  LogIn,
  LogOut,
  Settings,

  // Layout
  Home,
  LayoutDashboard,
  PanelLeft,
  PanelRight,
  Maximize,
  Minimize,

  // Media & Files
  Image,
  File,
  FileText,
  Folder,
  FolderOpen,

  // Communication
  Mail,
  MessageSquare,
  Bell,
  Phone,

  // Commerce
  ShoppingCart,
  CreditCard,
  DollarSign,

  // Social
  Heart,
  Star,
  ThumbsUp,
  Bookmark,

  // Misc
  Calendar,
  Map,
  Link,
  Globe,
  Moon,
  Sun,
  Sparkles,
  Zap,

  type LucideIcon,
} from 'lucide-react';

/** All available icons with consistent naming */
export const Icons = {
  // Navigation & UI
  menu: Menu,
  close: X,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  externalLink: ExternalLink,
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,

  // Actions
  plus: Plus,
  minus: Minus,
  check: Check,
  copy: Copy,
  trash: Trash2,
  edit: Edit,
  save: Save,
  download: Download,
  upload: Upload,
  share: Share,
  send: Send,
  refresh: RefreshCw,
  undo: RotateCcw,

  // Status & Feedback
  alertCircle: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  error: XCircle,
  spinner: Loader2,
  clock: Clock,

  // Content
  search: Search,
  filter: Filter,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  eye: Eye,
  eyeOff: EyeOff,

  // User & Auth
  user: User,
  users: Users,
  userPlus: UserPlus,
  login: LogIn,
  logout: LogOut,
  settings: Settings,

  // Layout
  home: Home,
  dashboard: LayoutDashboard,
  panelLeft: PanelLeft,
  panelRight: PanelRight,
  maximize: Maximize,
  minimize: Minimize,

  // Media & Files
  image: Image,
  file: File,
  fileText: FileText,
  folder: Folder,
  folderOpen: FolderOpen,

  // Communication
  mail: Mail,
  message: MessageSquare,
  bell: Bell,
  phone: Phone,

  // Commerce
  cart: ShoppingCart,
  creditCard: CreditCard,
  dollar: DollarSign,

  // Social
  heart: Heart,
  star: Star,
  thumbsUp: ThumbsUp,
  bookmark: Bookmark,

  // Misc
  calendar: Calendar,
  map: Map,
  link: Link,
  globe: Globe,
  moon: Moon,
  sun: Sun,
  sparkles: Sparkles,
  zap: Zap,
} as const satisfies Record<string, LucideIcon>;

/** Icon name type for type-safe icon usage */
export type IconName = keyof typeof Icons;

/** Helper to get icon by name */
export function getIcon(name: IconName): LucideIcon {
  return Icons[name];
}