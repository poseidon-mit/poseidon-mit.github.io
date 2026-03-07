import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

const ActionSheet = DialogPrimitive.Root
const ActionSheetTrigger = DialogPrimitive.Trigger

const ActionSheetOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
ActionSheetOverlay.displayName = 'ActionSheetOverlay'

const ActionSheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <ActionSheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed bottom-0 inset-x-0 z-50 flex flex-col max-h-[85vh] rounded-t-[24px] border-t border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        'duration-300',
        className,
      )}
      {...props}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-2 shrink-0">
        <div className="w-10 h-1 rounded-full bg-white/20" />
      </div>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
ActionSheetContent.displayName = 'ActionSheetContent'

const ActionSheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 pb-4 border-b border-white/[0.06] shrink-0', className)} {...props} />
)
ActionSheetHeader.displayName = 'ActionSheetHeader'

const ActionSheetBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1 overflow-y-auto px-6 py-4', className)} {...props} />
)
ActionSheetBody.displayName = 'ActionSheetBody'

const ActionSheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-4 border-t border-white/[0.06] shrink-0 flex flex-col gap-3', className)} {...props} />
)
ActionSheetFooter.displayName = 'ActionSheetFooter'

export {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetHeader,
  ActionSheetBody,
  ActionSheetFooter,
}
