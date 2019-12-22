export declare class CalciteButton {
    el: HTMLElement;
    /** specify the color of the button, defaults to blue */
    color: "blue" | "dark" | "light" | "red";
    /** specify the appearance style of the button, defaults to solid. Specifying "inline" will render the component as an anchor */
    appearance: "solid" | "outline" | "clear" | "inline";
    /** Select theme (light or dark) */
    theme: "light" | "dark";
    /** specify the scale of the button, defaults to m */
    scale: "xs" | "s" | "m" | "l" | "xl";
    /** specify the width of the button, defaults to auto */
    width: "auto" | "half" | "full";
    /** optionally add a calcite-loader component to the button, disabling interaction.  */
    loading?: boolean;
    /** optionally add a round style to the button  */
    round?: boolean;
    /** optionally add a floating style to the button - this should be positioned fixed or sticky */
    floating?: boolean;
    /** optionally pass a href - used to determine if the component should render as a button or an anchor */
    href?: string;
    /** optionally pass icon path data - pass only raw path data from calcite ui helper  */
    icon?: string;
    /** optionally used with icon, select where to position the icon */
    iconPosition?: "start" | "end";
    /** is the button disabled  */
    disabled?: boolean;
    connectedCallback(): void;
    componentWillLoad(): void;
    render(): any;
    setFocus(): Promise<void>;
    /** if button type is present, assign as prop */
    private type?;
    /** the rendered child element */
    private childEl?;
    /** the node type of the rendered child element */
    private childElType?;
    /** determine if there is slotted text for styling purposes */
    private hasText;
    private getAttributes;
    private handleClick;
}
