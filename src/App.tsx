import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import MembersList from "@/pages/members";
import Reports from "@/pages/reports";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import ManageMembers from "@/pages/admin/members";
import ManageDonations from "@/pages/admin/donations";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/members" component={MembersList} />
        <Route path="/reports" component={Reports} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/members" component={ManageMembers} />
        <Route path="/admin/donations" component={ManageDonations} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
