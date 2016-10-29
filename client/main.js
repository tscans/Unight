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
//admin pages
import AdminSelect from './components/admin/admin_select';
import AdminManageMain from './components/admin/manage/admin_manage_main';
import AdminLivelookMain from './components/admin/livelook/admin_livelook_main';
import Deals from './components/admin/deals/admin_deals_main';
import DealsS from './components/admin/deals/admin_deals_main_s';
import DealsG from './components/admin/deals/admin_deals_main_g';
import AdminSelectPull from './components/admin/select/admin_select_pull';
import AdminDealMain from './components/admin/deal/admin_deal_main';
import AdminDealMainS from './components/admin/deal/admin_deal_main_s';
import AdminDealMainG from './components/admin/deal/admin_deal_main_g';
import AdminEventsMain from './components/admin/events/admin_events_main';
import AdminEventMain from './components/admin/event/admin_event_main';
import AdminAccount from './components/admin/account/admin_account';
//user pages
import User from './components/user/user';
import UserMainBody from './components/user/main/user_main_body';
import MemMainBody from './components/user/memberships/mem_main_body';
import MemOrgBody from './components/user/orgpage/mem_org_body';
import MemWgotBody from './components/user/wgot/mem_wgot_body';
import MemWgoteBody from './components/user/wgote/mem_wgote_body';
import MemWgotdBody from './components/user/wgotd/mem_wgotd_body';
import MemTomBook from './components/user/tombook/mem_tombook';
import UserAccount from './components/user/account/user_account';

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
		</Route>
		<Route path="/admin-select/" component={AdminSelect}>
			<IndexRoute component={AdminSelectPull} />
			<Route path="account" component={AdminAccount} />
		</Route>
		<Route path="/admin/:pageId/" component={Admin}>
			<IndexRoute component={AdminMainBody} />
			<Route path="manage" component={AdminManageMain} />
			<Route path="livelook" component={AdminLivelookMain} />
			<Route path="events" component={AdminEventsMain} />
			<Route path="deals" component={Deals} />
			<Route path="deals-silver" component={DealsS} />
			<Route path="deals-gold" component={DealsG} />
			<Route path="deals/:pageId/" component={AdminDealMain} />
			<Route path="deals-silver/:pageId/" component={AdminDealMainS} />
			<Route path="deals-gold/:pageId/" component={AdminDealMainG} />
			<Route path="events/:pageId/" component={AdminEventMain} />
		</Route>
		<Route path="/user/" component={User}>
			<IndexRoute component={UserMainBody} />
			<Route path="memberships" component={MemMainBody} />
			<Route path="memberships/:zipId/" component={MemMainBody} />
			<Route path="membership/:pageId/" component={MemOrgBody} />
			<Route path="wgot" component={MemWgotBody} />
			<Route path="wgot/e/:pageId/" component={MemWgoteBody} />
			<Route path="wgot/d/:pageId/" component={MemWgotdBody} />
			<Route path="wgot/s/:pageId/" component={MemWgotdBody} />
			<Route path="wgot/g/:pageId/" component={MemWgotdBody} />
			<Route path="tombook" component={MemTomBook} />
			<Route path="account" component={UserAccount} />
		</Route>
	</Router>
);

Meteor.startup(() => {
	ReactDOM.render(routes, document.querySelector('.render-target'));
});
