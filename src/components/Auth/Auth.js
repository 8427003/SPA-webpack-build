import React, {Component} from 'react';


const PREXFIX_LOGIN = 'userinfo';

const Auth = {
    userInfo: null,
    getInfo() {
        const info = sessionStorage.getItem(PREXFIX_LOGIN);
        if(info){
            return JSON.parse(info);
        }
        return;
    },
    getMenuMap() {
        const  info = this.getInfo();
        if(info && info.menus){
            return menus2Map(info.menus);
        }
        return new Map();
    },
    signin(cb) {
        $.getJSON('/profile/info').done((res) => {
            if (0 !== res.error.returnCode) {
                this.userInfo = null;
                console.log('登陆失败！');
                cb();
            }

            this.userInfo = res.data;
            sessionStorage.setItem(PREXFIX_LOGIN, JSON.stringify(this.userInfo));
            cb();
        })
    },
    signout(cb) {
        this.userInfo = null;
        this.menuMap = null;
        sessionStorage.removeItem(PREXFIX_LOGIN);
        cb();
    }
}

function menus2Map(menus){
    menus =  menus || [];
    const urlMap = new Map();

    function walk(menus){
        menus.forEach(item => {
            if(item.url) {
                urlMap.set(item.url, item);
            }

            if(item.children) {
                walk(item.children);
            }
        })
    }
    walk(menus);

    return urlMap;
}

export  default Auth;
