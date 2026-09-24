"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavigationMenuContextValue {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
}

const NavigationMenuContext =
  React.createContext<NavigationMenuContextValue | null>(null);

const NavigationMenuItemContext = React.createContext<{ id: string }>({
  id: "",
});

const NavigationMenu = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    viewport?: boolean;
  }
>(({ className, children, viewport = true, ...props }, ref) => {
  const [activeItem, setActiveItemState] = React.useState<string | null>(null);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const cancelClose = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveItemState(null);
    }, 140);
  }, [cancelClose]);

  const setActiveItem = React.useCallback(
    (id: string | null) => {
      cancelClose();
      setActiveItemState(id);
    },
    [cancelClose]
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveItemState(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <NavigationMenuContext.Provider
      value={{ activeItem, setActiveItem, scheduleClose, cancelClose }}
    >
      <nav
        ref={ref}
        data-viewport={viewport}
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
        className={cn(
          "relative z-10 flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
});
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement> & { value?: string }
>(({ className, value, children, ...props }, ref) => {
  const generatedId = React.useId();
  const itemId = value ?? generatedId;

  return (
    <NavigationMenuItemContext.Provider value={{ id: itemId }}>
      <li ref={ref} className={cn("relative", className)} {...props}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
});
NavigationMenuItem.displayName = "NavigationMenuItem";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer"
);

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onMouseEnter, onClick, ...props }, ref) => {
  const menuCtx = React.useContext(NavigationMenuContext);
  const itemCtx = React.useContext(NavigationMenuItemContext);
  const isOpen = menuCtx?.activeItem === itemCtx.id;

  return (
    <button
      ref={ref}
      type="button"
      data-state={isOpen ? "open" : "closed"}
      aria-expanded={isOpen}
      onMouseEnter={(e) => {
        menuCtx?.setActiveItem(itemCtx.id);
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        menuCtx?.setActiveItem(isOpen ? null : itemCtx.id);
        onClick?.(e);
      }}
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDown
        className={cn(
          "relative top-[1px] ml-1 h-3 w-3 transition duration-300",
          isOpen && "rotate-180"
        )}
        aria-hidden="true"
      />
    </button>
  );
});
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const menuCtx = React.useContext(NavigationMenuContext);
  const itemCtx = React.useContext(NavigationMenuItemContext);
  const isOpen = menuCtx?.activeItem === itemCtx.id;

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      onMouseEnter={() => menuCtx?.cancelClose()}
      onMouseLeave={() => menuCtx?.scheduleClose()}
      onClick={() => menuCtx?.setActiveItem(null)}
      className={cn(
        "border-border/80 bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-full left-0 z-50 mt-2 w-auto overflow-hidden rounded-2xl border shadow-2xl duration-150",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp ref={ref} className={cn("block select-none", className)} {...props}>
      {children}
    </Comp>
  );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute top-full left-0 flex justify-center", className)}
    {...props}
  />
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
      className
    )}
    {...props}
  >
    <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
  </div>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
