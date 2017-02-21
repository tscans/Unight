import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Landing from './components/landing/landing';
import MainLanding from './components/landing/main/main_landing';
import UserSignup from './components/landing/signups/user_signup';
import OrgSignup from './components/landing/signups/org_signup';
import Admin from './components/admin/admin';
import AdminMainBody from './components/admin/main/admin_main_body';
//logins
import Login from './components/landing/login/login';
import LoginUser from './components/landing/login/login_user';
import LoginOrg from './components/landing/login/login_org';
import Verify from './components/landing/verify/verify';
//admin pages
import AdminSelect from './components/admin/admin_select';
import AltNotes from './components/admin/altnotes/altnotes';
import AdminManageMain from './components/admin/manage/admin_manage_main';
import AdminLivelookMain from './components/admin/livelook/admin_livelook_main';
import Deals from './components/admin/deals/admin_deals_main';
import DealsG from './components/admin/deals/admin_deals_main_g';
import AdminSelectPull from './components/admin/select/admin_select_pull';
import AdminDealMain from './components/admin/deal/admin_deal_main';
import AdminDealMainG from './components/admin/deal/admin_deal_main_g';
import AdminEventsMain from './components/admin/events/admin_events_main';
import AdminEventMain from './components/admin/event/admin_event_main';
import AdminAccount from './components/admin/account/admin_account';
import AdminGiftMain from './components/admin/gift/admin_gift_main';
import AdminClearance from './components/admin/clearance/admin_clearance';
//user pages
import User from './components/user/user';
import MemMainBody from './components/user/memberships/mem_main_body';
import MemOrgBody from './components/user/orgpage/mem_org_body';
import MemWgotBody from './components/user/wgot/mem_wgot_body';
import MemWgoteBody from './components/user/wgote/mem_wgote_body';
import MemWgotdBody from './components/user/wgotd/mem_wgotd_body';
import MemTomBook from './components/user/tombook/mem_tombook';
import UserAccount from './components/user/account/user_account';
import MemFinance from './components/user/account/mem_finance';
import MemNotes from './components/user/notes/mem_notes';

import NotFound from './components/404/not_found';

function requireAuth(nextState, replace) {
  if (!Meteor.userId()) {
    replace({
      pathname: '/admin',
      state: { nextPathname: '/' }
    }),
    replace({
      pathname: '/user',
      state: { nextPathname: '/' }
    })
  }
}
//local memberships
//local deals
//whats going on tonight
//rewards points
const routes = (
	<Router history={browserHistory}>
		<Route path="/" component={Landing}>
			<IndexRoute component={MainLanding} />
			<Route path="user_signup" component={UserSignup} />
			<Route path="org_signup" component={OrgSignup} />
			<Route path="login" component={Login} />
			<Route path="loginuser" component={LoginUser} />
			<Route path="loginorg" component={LoginOrg} />
			<Route path="verify/:call/:userID/:code/:pref" component={Verify} />
		</Route>
		<Route path="/admin-select/" component={AdminSelect}>
			<IndexRoute component={AdminSelectPull} />
			<Route path="account" component={AdminAccount} />
			<Route path="clearance" component={AdminClearance} />
			<Route path="altnotes" component={AltNotes} />
		</Route>
		<Route path="/admin/:pageId/" component={Admin}>
			<IndexRoute component={AdminMainBody} />
			<Route path="manage" component={AdminManageMain} />
			<Route path="livelook" component={AdminLivelookMain} />
			<Route path="events" component={AdminEventsMain} />
			<Route path="deals" component={Deals} />
			<Route path="deals-gold" component={DealsG} />
			<Route path="deals/:pageId/" component={AdminDealMain} />
			<Route path="deals-gold/:pageId/" component={AdminDealMainG} />
			<Route path="events/:pageId/" component={AdminEventMain} />
			<Route path="gift" component={AdminGiftMain} />
		</Route>
		<Route path="/user/" component={User}>
			<IndexRoute component={MemTomBook} />
			<Route path="memberships" component={MemMainBody} />
			<Route path="memberships/:pageId/" component={MemOrgBody} />
			<Route path="wgot" component={MemWgotBody} />
			<Route path="wgot/e/:pageId/" component={MemWgoteBody} />
			<Route path="wgot/d/:pageId/" component={MemWgotdBody} />
			<Route path="wgot/g/:pageId/" component={MemWgotdBody} />
			<Route path="account" component={UserAccount} />
			<Route path="finance" component={MemFinance} />
			<Route path="mem_notes" component={MemNotes} />
		</Route>
		<Route path="*" component={NotFound} />
	</Router>
);

Meteor.startup(() => {
	Stripe.setPublishableKey(Meteor.settings.public.StripePub);
	ReactDOM.render(routes, document.querySelector('.render-target'));
});
