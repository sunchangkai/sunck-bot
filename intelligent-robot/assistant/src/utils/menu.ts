import XEUtils from "xe-utils"
import {dynamicRoutes, staticRoutes} from "/@/router/route";

/**
 * @description: 处理后端菜单数据格式
 * @param {Array} menuData
 * @return {*}
 */
export const handleMenu = (menuData: Array<any>) => {
    // 先处理menu meta数据转换
    const handleMeta = (item: any) => {
        item.meta = {
            title: item.title,
            isLink: item.link_url,
            isHide: !item.visible,
            isKeepAlive: item.cache,
            isAffix: item.is_affix,
            isIframe: item.is_iframe,
            roles: ['admin'],
            icon: item.icon
        }
        item.name = item.component_name
        item.path = item.web_path
        return item
    }

    // 处理框架外的路由
    const handleFrame = (item: any) => {
        if (item.is_iframe) {
            item.meta = {
                title: item.title,
                isLink: item.link_url,
                isHide: !item.visible,
                isKeepAlive: item.cache,
                isAffix: item.is_affix,
                isIframe: item.is_iframe,
                roles: ['admin'],
                icon: item.icon
            }
            item.name = item.component_name
            item.path = item.web_path
        }
        return item
    }

    // 框架内路由
    const defaultRoutes:Array<any> = []
    // 框架外路由
    const iframeRoutes:Array<any> = []

    menuData.forEach((val) => {
        // if (val.is_iframe) {
        //     // iframeRoutes.push(handleFrame(val))
        // } else {
        //     defaultRoutes.push(handleMeta(val))
        // }
        defaultRoutes.push(handleMeta(val))
    })
    const data = XEUtils.toArrayTree(defaultRoutes, {
        parentKey: 'parent',
        strict: true,
    })
    const dynamicRoutes = [
        {
            path: '/dialogue', name: 'dialogue', component: '/assistant/dialogue/index', meta: {
                title: '对话',
                isLink: '',
                isHide: false,
                isKeepAlive: true,
                isAffix: true,
                isIframe: false,
                roles: ['admin'],
                icon: 'iconfont icon-gerenzhongxin'
            }
        },
		{
		    path: '/api/history', name: 'history', component: '/assistant/history/index', meta: {
		        title: '历史会话',
		        isLink: '',
		        isHide: false,
		        isKeepAlive: true,
		        isAffix: true,
		        isIframe: false,
		        roles: ['admin'],
		        icon: 'iconfont icon-dict'
		    }
		},
		{
		    path: '/api/collection', name: 'collection', component: '/assistant/collection/index', meta: {
		        title: '收藏会话',
		        isLink: '',
		        isHide: false,
		        isKeepAlive: true,
		        isAffix: true,
		        isIframe: false,
		        roles: ['admin'],
		        icon: 'iconfont icon-file'
		    }
		},
        // ...data
    ]
    return {frameIn:dynamicRoutes,frameOut:iframeRoutes}
}
