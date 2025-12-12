import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import StreamerProfile from "./pages/StreamerProfile";
import Call from "./pages/Call";
import Admin from "./pages/Admin";
import ShareProfile from "./pages/ShareProfile";
import ViewerOnboarding from "./pages/ViewerOnboarding";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ViewerDashboard from "./pages/ViewerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportsAdmin from "./pages/ReportsAdmin";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import MyProfile from "./pages/MyProfile";
import AdminCommissions from "./pages/AdminCommissions";
import { IncomingCallNotification } from "./components/IncomingCallNotification";
import CallHistory from "./pages/CallHistory";
import Withdrawal from "./pages/Withdrawal";
import HowItWorks from "./pages/HowItWorks";
import Security from "./pages/Security";
import Terms from "./pages/Terms";
import WhyJoin from "./pages/WhyJoin";
import FAQ from "./pages/FAQ";
import CommissionPolicy from "./pages/CommissionPolicy";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import { BalanceSuccess } from "./pages/BalanceSuccess";
import { BalanceFailure } from "./pages/BalanceFailure";
import { TransactionHistory } from "./pages/TransactionHistory";
import WithdrawalHistory from "./pages/WithdrawalHistory";
import Leaderboard from "./pages/Leaderboard";
import AdminKYCReview from "./pages/AdminKYCReview";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={SignUp} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/verify-email"} component={VerifyEmail} />
      <Route path={"/onboarding"} component={Onboarding} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/feed"} component={Feed} />
      <Route path={"/streamer/:id"} component={StreamerProfile} />
      <Route path={"/call/:streamerId"} component={Call} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/share-profile"} component={ShareProfile} />
      <Route path={"/viewer-onboarding"} component={ViewerOnboarding} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/viewer-dashboard"} component={ViewerDashboard} />
      <Route path={"/admin-dashboard"} component={AdminDashboard} />
      <Route path={"/reports"} component={ReportsAdmin} />
      <Route path={"/my-profile"} component={MyProfile} />
      <Route path={"/admin-commissions"} component={AdminCommissions} />
      <Route path={"/withdrawal"} component={Withdrawal} />
      <Route path={"/call-history"} component={CallHistory} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/security"} component={Security} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/why-join"} component={WhyJoin} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/commission-policy"} component={CommissionPolicy} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/balance-success"} component={BalanceSuccess} />
      <Route path={"/balance-failure"} component={BalanceFailure} />
      <Route path={"/transactions"} component={TransactionHistory} />
      <Route path={"/withdrawal-history"} component={WithdrawalHistory} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      <Route path={"/admin-kyc"} component={AdminKYCReview} />
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/terms-of-service"} component={TermsOfService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <IncomingCallNotification />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
