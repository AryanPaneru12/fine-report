
import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileSpreadsheet, 
  PieChart, 
  BarChart, 
  LogOut, 
  Sun, 
  Moon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Layout = ({ toggleTheme, isDarkMode }: LayoutProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="dark:bg-gray-900 bg-slate-50 border-r">
          <SidebarHeader className="flex items-center justify-center py-4">
            <h2 className="text-xl font-bold">Financial Analyzer</h2>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/dashboard' ? "secondary" : "ghost"} 
                        className="w-full justify-start" 
                        onClick={() => navigate('/dashboard')}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Data</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/reports' ? "secondary" : "ghost"} 
                        className="w-full justify-start" 
                        onClick={() => navigate('/reports')}
                      >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <span>Financial Reports</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/view-reports' ? "secondary" : "ghost"} 
                        className="w-full justify-start" 
                        onClick={() => navigate('/view-reports')}
                      >
                        <BarChart className="mr-2 h-4 w-4" />
                        <span>View Reports</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/ratios' ? "secondary" : "ghost"} 
                        className="w-full justify-start" 
                        onClick={() => navigate('/ratios')}
                      >
                        <PieChart className="mr-2 h-4 w-4" />
                        <span>Key Ratios</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={toggleTheme}
            >
              {isDarkMode ? 
                <><Sun className="mr-2 h-4 w-4" /><span>Light Mode</span></> : 
                <><Moon className="mr-2 h-4 w-4" /><span>Dark Mode</span></>
              }
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 p-6 overflow-auto">
          <SidebarTrigger />
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
