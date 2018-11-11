exports.userMenu = function loadMenu(ROLE){
 var menu = [
     {
       title: "Principal",
       icon: "mdi mdi-gauge",
       subMenu: [
         { title: "Progress", URL: '/progress' },
         { title: "Charts", URL: '/charts' },
         { title: "Promises", URL: '/promises'},
         { title: "Rxjs", URL: '/rxjs'}
       ]
     }
   ];

  if (ROLE === 'ADMIN_ROLE'){
    menu.push({
      title: "Administrar",
      icon: "mdi mdi-folder-lock-open",
      subMenu: [
        { title: "Usuarios", URL: '/users' },
        { title: "Hospitales", URL: '/hospitals' },
        { title: "Doctores", URL: '/doctors'}
      ]
    });
  }
  return menu;
}
