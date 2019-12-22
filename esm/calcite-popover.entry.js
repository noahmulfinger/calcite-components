import { h, r as registerInstance, H as Host, g as getElement } from './core-4df481c3.js';
import './dom-e9ddd61f.js';
import { a as x16 } from './index-b8494b34.js';
import { g as guid } from './guid-cb609d41.js';
import { P as Popper, g as getPlacement } from './popper-4e0f0ab3.js';

const CSS = {
    container: "container",
    containerOpen: "container--open",
    containerPointer: "container--pointer",
    contentContainer: "content-container",
    imageContainer: "image-container",
    closeButton: "close-button",
    content: "content"
};

const CalciteIcon = ({ path, size, svgAttributes, title }) => (h("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", height: size, width: size, fill: "currentColor", viewBox: `0 0 ${size} ${size}` }, svgAttributes),
    title ? h("title", null, title) : null,
    h("path", { d: path })));

const CalcitePopover = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        // --------------------------------------------------------------------------
        //
        //  Properties
        //
        // --------------------------------------------------------------------------
        /**
         * Adds a click handler to the referenceElement to toggle open the Popover.
         */
        this.addClickHandle = false;
        /**
         * Display a close button within the Popover.
         */
        this.closeButton = false;
        /**
         * Prevents flipping the popover's placement when it starts to overlap its reference element.
         */
        this.disableFlip = false;
        /**
         * Removes the caret pointer.
         */
        this.disablePointer = false;
        /**
         * Makes the popover flow toward the inner of the reference element.
         */
        this.flowInner = false;
        /**
         * Display and position the component.
         */
        this.open = false;
        /**
         * Determines where the component will be positioned relative to the referenceElement.
         */
        this.placement = "auto";
        /** Text for close button. */
        this.textClose = "Close";
        /** Select theme (light or dark) */
        this.theme = "light";
        /**
         * Offset the position of the popover in the horizontal direction.
         */
        this.xOffset = 0;
        /**
         * Offset the position of the popover in the vertical direction.
         */
        this.yOffset = 0;
        this._referenceElement = this.getReferenceElement();
        this._boundariesElement = this.getBoundariesElement();
        // --------------------------------------------------------------------------
        //
        //  Private Methods
        //
        // --------------------------------------------------------------------------
        this.getId = () => {
            return this.el.id || `calcite-popover-${guid()}`;
        };
        this.addReferenceAria = () => {
            const { _referenceElement } = this;
            if (_referenceElement &&
                !_referenceElement.hasAttribute("aria-describedby")) {
                _referenceElement.setAttribute("aria-describedby", this.getId());
            }
        };
        this.clickHandler = () => {
            this.toggle();
        };
        this.addReferenceListener = () => {
            const { _referenceElement, addClickHandle } = this;
            if (!_referenceElement || !addClickHandle) {
                return;
            }
            _referenceElement.addEventListener("click", this.clickHandler);
        };
        this.removeReferenceListener = () => {
            const { _referenceElement } = this;
            if (!_referenceElement) {
                return;
            }
            _referenceElement.removeEventListener("click", this.clickHandler);
        };
        this.hide = () => {
            this.open = false;
        };
    }
    interactionElementHandler() {
        this.removeReferenceListener();
        this.addReferenceListener();
    }
    boundariesElementHandler() {
        this._boundariesElement = this.getBoundariesElement();
        this.destroyPopper();
        this.reposition();
    }
    openHandler(open) {
        if (open) {
            this.reposition();
        }
        else {
            this.destroyPopper();
        }
    }
    placementHandler() {
        this.destroyPopper();
        this.reposition();
    }
    referenceElementHandler() {
        this.removeReferenceListener();
        this._referenceElement = this.getReferenceElement();
        this.addReferenceListener();
        this.addReferenceAria();
        this.destroyPopper();
        this.reposition();
    }
    xOffsetHandler() {
        this.destroyPopper();
        this.reposition();
    }
    yOffsetHandler() {
        this.destroyPopper();
        this.reposition();
    }
    // --------------------------------------------------------------------------
    //
    //  Lifecycle
    //
    // --------------------------------------------------------------------------
    componentDidLoad() {
        this.reposition();
        this.addReferenceListener();
        this.addReferenceAria();
    }
    componentDidUnload() {
        this.removeReferenceListener();
        this.destroyPopper();
    }
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------
    async reposition() {
        const { popper } = this;
        popper ? this.updatePopper(popper) : this.createPopper();
    }
    async toggle() {
        this.open = !this.open;
    }
    getReferenceElement() {
        const { referenceElement } = this;
        return ((typeof referenceElement === "string"
            ? document.getElementById(referenceElement)
            : referenceElement) || null);
    }
    getBoundariesElement() {
        const { boundariesElement } = this;
        return ((typeof boundariesElement === "string"
            ? document.getElementById(boundariesElement)
            : boundariesElement) || null);
    }
    getModifiers() {
        const verticalRE = /top|bottom/gi;
        const autoRE = /auto/gi;
        const { _boundariesElement, disableFlip, flipPlacements, flowInner, placement, xOffset, yOffset } = this;
        const offsetEnabled = !!(yOffset || xOffset) && !autoRE.test(placement);
        const offsets = [yOffset, xOffset];
        if (verticalRE.test(placement)) {
            offsets.reverse();
        }
        return {
            preventOverflow: {
                enabled: true,
                boundariesElement: _boundariesElement || "viewport",
                escapeWithReference: true
            },
            flip: {
                enabled: !disableFlip,
                boundariesElement: _boundariesElement || "viewport",
                flipVariationsByContent: true,
                behavior: flipPlacements || "flip"
            },
            inner: {
                enabled: flowInner
            },
            offset: {
                enabled: !!offsetEnabled,
                offset: offsets.join(",")
            }
        };
    }
    createPopper() {
        const { el, open, placement, _referenceElement } = this;
        if (!_referenceElement || !open) {
            return;
        }
        const newPopper = new Popper(_referenceElement, el, {
            placement: getPlacement(el, placement),
            modifiers: this.getModifiers()
        });
        this.popper = newPopper;
    }
    updatePopper(popper) {
        popper.options.placement = getPlacement(this.el, this.placement);
        popper.options.modifiers = Object.assign(Object.assign({}, popper.options.modifiers), this.getModifiers());
        popper.scheduleUpdate();
    }
    destroyPopper() {
        const { popper } = this;
        if (popper) {
            popper.destroy();
        }
        this.popper = null;
    }
    // --------------------------------------------------------------------------
    //
    //  Render Methods
    //
    // --------------------------------------------------------------------------
    renderImage() {
        return this.el.querySelector("[slot=image]") ? (h("div", { class: CSS.imageContainer }, h("slot", { name: "image" }))) : null;
    }
    renderCloseButton() {
        const { closeButton, textClose } = this;
        return closeButton ? (h("button", { "aria-label": textClose, title: textClose, class: { [CSS.closeButton]: true }, onClick: this.hide }, h(CalciteIcon, { size: "16", path: x16 }))) : null;
    }
    render() {
        const { _referenceElement, open, disablePointer } = this;
        const displayed = _referenceElement && open;
        return (h(Host, { role: "dialog", "aria-hidden": !displayed ? "true" : "false", id: this.getId() }, h("div", { class: {
                [CSS.container]: true,
                [CSS.containerOpen]: displayed,
                [CSS.containerPointer]: !disablePointer
            } }, h("div", { class: CSS.contentContainer }, this.renderImage(), h("div", { class: CSS.content }, h("slot", null), this.renderCloseButton())))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "addClickHandle": ["interactionElementHandler"],
        "boundariesElement": ["boundariesElementHandler"],
        "open": ["openHandler"],
        "placement": ["placementHandler"],
        "referenceElement": ["referenceElementHandler"],
        "xOffset": ["xOffsetHandler"],
        "yOffset": ["yOffsetHandler"]
    }; }
    static get style() { return ":root{--calcite-ui-blue:#007ac2;--calcite-ui-blue-hover:#2890ce;--calcite-ui-blue-press:#00619b;--calcite-ui-green:#35ac46;--calcite-ui-green-hover:#50ba5f;--calcite-ui-green-press:#288835;--calcite-ui-yellow:#edd317;--calcite-ui-yellow-hover:#f9e54e;--calcite-ui-yellow-press:#d9bc00;--calcite-ui-red:#d83020;--calcite-ui-red-hover:#e65240;--calcite-ui-red-press:#a82b1e;--calcite-ui-background:#f8f8f8;--calcite-ui-foreground:#fff;--calcite-ui-foreground-hover:#f3f3f3;--calcite-ui-foreground-press:#eaeaea;--calcite-ui-text-1:#151515;--calcite-ui-text-2:#4a4a4a;--calcite-ui-text-3:#6a6a6a;--calcite-ui-border-1:#cacaca;--calcite-ui-border-2:#dfdfdf;--calcite-ui-border-3:#eaeaea;--calcite-ui-border-hover:#9f9f9f;--calcite-ui-border-press:#757575}:host([theme=dark]){--calcite-ui-blue:#00a0ff;--calcite-ui-blue-hover:#0087d7;--calcite-ui-blue-press:#47bbff;--calcite-ui-green:#36da43;--calcite-ui-green-hover:#11ad1d;--calcite-ui-green-press:#44ed51;--calcite-ui-yellow:#ffc900;--calcite-ui-yellow-hover:#f4b000;--calcite-ui-yellow-press:#ffe24d;--calcite-ui-red:#fe583e;--calcite-ui-red-hover:#f3381b;--calcite-ui-red-press:#ff7465;--calcite-ui-background:#202020;--calcite-ui-foreground:#2b2b2b;--calcite-ui-foreground-hover:#353535;--calcite-ui-foreground-press:#404040;--calcite-ui-text-1:#fff;--calcite-ui-text-2:#bfbfbf;--calcite-ui-text-3:#9f9f9f;--calcite-ui-border-1:#4a4a4a;--calcite-ui-border-2:#404040;--calcite-ui-border-3:#353535;--calcite-ui-border-hover:#757575;--calcite-ui-border-press:#9f9f9f}:root{--calcite-border-radius:3px}:host([hidden]){display:none}body{font-family:Avenir Next W01,Avenir Next W00,Avenir Next,Avenir,Helvetica Neue,sans-serif}.overflow-hidden{overflow:hidden}calcite-tab{display:none}calcite-tab[is-active]{display:block}a{color:#007ac2}:host{display:block;position:absolute;z-index:999;top:-999999px;left:-999999px}.container{border-radius:var(--calcite-border-radius);-webkit-box-shadow:0 0 16px 0 rgba(0,0,0,.16);box-shadow:0 0 16px 0 rgba(0,0,0,.16);position:relative;visibility:hidden}.container--open{visibility:visible}:host([x-out-of-boundaries]) .container{visibility:hidden}.content-container{max-width:350px;overflow:hidden;-ms-flex-direction:column;flex-direction:column;background:var(--calcite-ui-foreground);color:var(--calcite-ui-text-1)}.content,.content-container{display:-ms-flexbox;display:flex}.content{-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:justify;justify-content:space-between;line-height:24px}.close-button{display:-ms-flexbox;display:flex;-ms-flex-pack:end;justify-content:flex-end;width:40px;height:45px;z-index:1;background:var(--calcite-ui-foreground);color:var(--calcite-ui-text-1);padding:16px 12px;border:none;display:block;cursor:pointer;border-top-right-radius:2px}.close-button:hover{background:var(--calcite-ui-foreground-hover)}.close-button:active{background:var(--calcite-ui-foreground-press)}.image-container{overflow:hidden;max-height:200px;margin:5px}slot[name=image]::slotted(img){height:auto;width:100%;max-height:200px;-o-object-position:50% 50%;object-position:50% 50%;-o-object-fit:cover;object-fit:cover}.container--pointer .content-container:after{position:absolute;content:\"\";font-size:0;line-height:0}:host([x-placement=top-start]) .container--pointer .content-container:after{top:100%;left:5px;width:0;border-top:5px solid var(--calcite-ui-foreground);border-right:5px solid transparent;border-left:5px solid transparent}:host([x-placement=top]) .container--pointer .content-container:after{top:100%;left:50%;margin-left:-5px;width:0;border-top:5px solid var(--calcite-ui-foreground);border-right:5px solid transparent;border-left:5px solid transparent}:host([x-placement=top-end]) .container--pointer .content-container:after{top:100%;right:5px;width:0;border-top:5px solid var(--calcite-ui-foreground);border-right:5px solid transparent;border-left:5px solid transparent}:host([x-placement=right-start]) .container--pointer .content-container:after{right:100%;top:5px;width:0;border-right:5px solid var(--calcite-ui-foreground);border-top:5px solid transparent;border-bottom:5px solid transparent}:host([x-placement=right]) .container--pointer .content-container:after{right:100%;top:50%;margin-top:-5px;width:0;border-right:5px solid var(--calcite-ui-foreground);border-top:5px solid transparent;border-bottom:5px solid transparent}:host([x-placement=right-end]) .container--pointer .content-container:after{right:100%;bottom:5px;width:0;border-right:5px solid var(--calcite-ui-foreground);border-top:5px solid transparent;border-bottom:5px solid transparent}:host([x-placement=bottom-start]) .container--pointer .content-container:after{bottom:100%;left:5px;width:0;border-bottom:5px solid var(--calcite-ui-foreground);border-right:5px solid transparent;border-left:5px solid transparent}:host([x-placement=bottom]) .container--pointer .content-container:after{bottom:100%;left:50%;margin-left:-5px;width:0;border-bottom:5px solid var(--calcite-ui-foreground);border-right:5px solid transparent;border-left:5px solid transparent}:host([x-placement=bottom-end]) .container--pointer .content-container:after{bottom:100%;right:5px;width:0;border-bottom:5px solid var(--calcite-ui-foreground);border-right:5px solid transparent;border-left:5px solid transparent}:host([x-placement=left-start]) .container--pointer .content-container:after{left:100%;top:5px;width:0;border-left:5px solid var(--calcite-ui-foreground);border-top:5px solid transparent;border-bottom:5px solid transparent}:host([x-placement=left]) .container--pointer .content-container:after{left:100%;top:50%;margin-top:-5px;width:0;border-left:5px solid var(--calcite-ui-foreground);border-top:5px solid transparent;border-bottom:5px solid transparent}:host([x-placement=left-end]) .container--pointer .content-container:after{left:100%;bottom:5px;width:0;border-left:5px solid var(--calcite-ui-foreground);border-top:5px solid transparent;border-bottom:5px solid transparent}:host([x-placement*=bottom]) .container--pointer,:host([x-placement*=top]) .container--pointer{margin:5px 0}:host([x-placement*=left]) .container--pointer,:host([x-placement*=right]) .container--pointer{margin:0 5px}"; }
};

export { CalcitePopover as calcite_popover };
