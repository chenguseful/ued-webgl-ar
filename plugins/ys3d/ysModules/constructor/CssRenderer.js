/* cssRenderer */
import state from  '../state.js'
const D = document
const CssRenderer = function (cssRender, cssObject) {
    const T = this // 非app
    const el = state.el
    T.config = {}
    T.init = function () {
        const cssRenderer = new cssRender()
        cssRenderer.setSize( el.offsetWidth, el.offsetHeight )
        cssRenderer.domElement.style.position = 'absolute'
        cssRenderer.domElement.style.top = 0
        // cssRenderer.domElement.style.pointerEvents = "none"
        el.appendChild(cssRenderer.domElement)
        T.cssRenderer = cssRenderer
        T.cssRendererDomElement = cssRenderer.domElement
    }
    T.add = function (option) {
        let list  = []
        if( Array.isArray(option))
            list = option
        else
            list.push(option)
        list.forEach(e => {
            D.body.insertAdjacentHTML('beforeend', e.element)
            const label = new cssObject( D.body.lastChild )
            label.userData.isCss23D  = true
            label.position.set(e.position[0], e.position[1], e.position[2])
            label.name = e.name
            if(e.scale) label.scale.set(e.scale[0], e.scale[1], e.scale[2])
            e.parent ? e.parent.add(label) : state.scene.add(label)
            T.config[e.name] = label
        })
    }
    T.update = function (name, innerHtml) {
        T.config[name].element.innerHTML = innerHtml
    }
    T.remove = function (name, parent) {
        parent = parent || state.scene
        parent.remove(parent.getObjectByName(name))
        // T.config[name].element.remove()
        if(T.config[name]) delete T.config[name]

    }
    T.search = function (name) {
        return  T.config[name]
    }
    T.removeAll = function(parent) {
        //需要倒序遍历
        for(let i = parent.children.length - 1 ; i>=0; i--) {
            const e = parent.children[i]
            if( e.userData.isCss23D ) {
                const name = e.name
                parent.remove(e)
                if(T.config[name]) delete T.config[name]
            }
        }
    }
    T.init()
}

export default  CssRenderer