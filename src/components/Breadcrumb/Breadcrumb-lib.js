import React from 'react';
import {Route, Link} from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';
//import routes from '../../routes';

// 菜单list
import menus from '../Sidebar/_nav.js';

// 根据菜单生成面包屑
let routes = {}

routes = {
  '/': 'Home',
  '/surveyManage/list': '问卷列表',
  '/surveyManage/list/detail/1': '问卷详情',
  '/charts': 'Charts',
  '/components/buttons': 'Buttons'
}



const findRouteName = url => routes[url];

const getPaths = (pathname) => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const BreadcrumbsItem = ({...rest, match}) => {
  const routeName = findRouteName(match.url);
  if (routeName) {
    return (
      match.isExact ?
        (
          <BreadcrumbItem active>{routeName}</BreadcrumbItem>
        ) :
        (
          <BreadcrumbItem>
            <Link to={match.url || ''}>
              {routeName}
            </Link>
          </BreadcrumbItem>
        )
    );
  }
  return null;
};

const Breadcrumbs = ({...rest, location : {pathname}, match}) => {
  const paths = getPaths(pathname);
  const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem}/>);
  return (
    <Breadcrumb>
      {items}
    </Breadcrumb>
  );
};
