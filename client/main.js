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
import AdminSelectPull from './components/admin/select/admin_select_pull';
//user pages
import User from './components/user/user';
import UserMainBody from './components/user/main/user_main_body';
import MemMainBody from './components/user/memberships/mem_main_body';

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
		</Route>
		<Route path="/admin/:pageId/" component={Admin}>
			<IndexRoute component={AdminMainBody} />
			<Route path="manage" component={AdminManageMain} />
			<Route path="livelook" component={AdminLivelookMain} />
			<Route path="deals" component={Deals} />
		</Route>
		<Route path="/user/" component={User}>
			<IndexRoute component={UserMainBody} />
			<Route path="memberships" component={MemMainBody} />
		</Route>
	</Router>
);

Meteor.startup(() => {
	ReactDOM.render(routes, document.querySelector('.render-target'));
});
