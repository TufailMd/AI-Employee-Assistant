import {
  BarChart3,
  Bell,
  Bot,
  Building2,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Home", icon: LayoutDashboard, to: "/" },
  { label: "Profile", icon: UserRound, to: "#" },
  { label: "Team", icon: Users, to: "#" },
  { label: "Payroll", icon: WalletCards, to: "#" },
  { label: "Analytics", icon: BarChart3, to: "#" },
];

const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/70 bg-white/90 px-4 shadow-sm backdrop-blur lg:pl-80 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <button className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container lg:hidden" type="button">
            <Menu size={20} />
          </button>
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-primary text-white sm:flex">
              <Building2 size={19} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-black tracking-tight text-primary">HR Intellect</p>
              <p className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant sm:block">
                {user.role === "admin" ? "Admin Console" : "Employee Workspace"}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden flex-1 justify-center px-8 md:flex">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input
              className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
              placeholder={user.role === "admin" ? "Search employees..." : "Search policies..."}
              type="search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container" type="button">
            <Bell size={19} />
          </button>
          <button className="hidden rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container sm:inline-flex" type="button">
            <Settings size={19} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary-container bg-primary text-sm font-black text-white">
            {getInitials(user.name)}
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-30 hidden h-full w-72 flex-col bg-surface-container px-2 pb-6 pt-20 lg:flex">
        <div className="mb-8 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <Building2 size={21} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-primary">Corporate Portal</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                {user.name}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className="flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface first:bg-secondary-container first:text-on-secondary-container"
                key={item.label}
                to={item.to}
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 px-4">
          <div className="rounded-xl border border-secondary/20 bg-white/70 p-4 shadow-panel">
            <div className="mb-3 flex items-center gap-2 text-secondary">
              <Bot size={18} />
              <span className="text-xs font-black uppercase tracking-[0.12em]">AI Ready</span>
            </div>
            <p className="text-sm leading-5 text-on-surface-variant">
              Ask for leave balances, salary details, or HR policy context.
            </p>
          </div>
          <button className="muted-button w-full justify-start" type="button">
            <CircleHelp size={18} />
            Help
          </button>
          <button className="muted-button w-full justify-start hover:border-error hover:text-error" onClick={logout} type="button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-outline-variant bg-white/90 px-3 py-2 shadow-soft backdrop-blur lg:hidden">
        {navItems.slice(0, 4).map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              className={`flex min-w-16 flex-col items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
                index === 0 ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant"
              }`}
              key={item.label}
              to={item.to}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
