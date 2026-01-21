import * as React from 'react';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR CONTEXT
// ═══════════════════════════════════════════════════════════════════

interface SidebarContextValue {
  isExpanded: boolean;
  isMobileOpen: boolean;
  toggleExpanded: () => void;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR PROVIDER
// ═══════════════════════════════════════════════════════════════════

interface SidebarProviderProps {
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function SidebarProvider({ children, defaultExpanded = true }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const toggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ isExpanded, isMobileOpen, toggleExpanded, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR ROOT
// ═══════════════════════════════════════════════════════════════════

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsedWidth?: string;
  expandedWidth?: string;
}

export function Sidebar({
  className,
  children,
  collapsedWidth = '4rem',
  expandedWidth = '16rem',
  ...props
}: SidebarProps) {
  const { isExpanded, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r bg-card transition-[width] duration-200 ease-in-out',
          className
        )}
        style={{ width: isExpanded ? expandedWidth : collapsedWidth }}
        {...props}
      >
        {children}
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Dialog.Root open={isMobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 md:hidden" />
          <Dialog.Content
            className={cn(
              'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card md:hidden',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
              'duration-200'
            )}
          >
            <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
            <Dialog.Description className="sr-only">Main navigation sidebar</Dialog.Description>
            <div className="flex items-center justify-end p-4">
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon">
                  <Icons.close className="h-5 w-5" />
                </Button>
              </Dialog.Close>
            </div>
            {children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR HEADER
// ═══════════════════════════════════════════════════════════════════

export function SidebarHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex h-14 items-center border-b px-4', className)} {...props}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR CONTENT
// ═══════════════════════════════════════════════════════════════════

export function SidebarContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-1 overflow-y-auto p-4', className)} {...props}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR FOOTER
// ═══════════════════════════════════════════════════════════════════

export function SidebarFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-t p-4', className)} {...props}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR NAV
// ═══════════════════════════════════════════════════════════════════

export function SidebarNav({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex flex-col gap-1', className)} {...props}>
      {children}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR NAV ITEM
// ═══════════════════════════════════════════════════════════════════

interface SidebarNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isActive?: boolean;
}

export function SidebarNavItem({
  className,
  children,
  icon,
  isActive,
  ...props
}: SidebarNavItemProps) {
  const { isExpanded } = useSidebar();

  return (
    <button
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
        !isExpanded && 'justify-center px-2',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {isExpanded && <span className="truncate">{children}</span>}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR TOGGLE BUTTON
// ═══════════════════════════════════════════════════════════════════

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleExpanded, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn('hidden md:flex', className)}
        onClick={toggleExpanded}
        {...props}
      >
        <Icons.panelLeft className="h-5 w-5" />
      </Button>

      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn('md:hidden', className)}
        onClick={() => setMobileOpen(true)}
        {...props}
      >
        <Icons.panelLeft className="h-5 w-5" />
      </Button>
    </>
  );
}