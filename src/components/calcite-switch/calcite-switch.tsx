import {
  Component,
  h,
  Prop,
  Event,
  Element,
  Host,
  EventEmitter,
  Listen,
  Watch,
  Build,
} from "@stencil/core";
import { SPACE, ENTER } from "../../utils/keys";

@Component({
  tag: "calcite-switch",
  styleUrl: "calcite-switch.scss",
  shadow: true,
})
export class CalciteSwitch {
  @Element() el: HTMLElement;

  /** True if the switch is initially on */
  @Prop({ reflect: true, mutable: true }) switched?: boolean = false;

  /** The name of the checkbox input */
  @Prop({ reflect: true, mutable: true }) name?: string = "";

  /** The value of the checkbox input */
  @Prop({ reflect: true, mutable: true }) value?: string = "";

  /** What color the switch should be */
  @Prop({ reflect: true, mutable: true }) color: "red" | "blue" = "blue";

  /** The scale of the switch */
  @Prop({ reflect: true, mutable: true }) scale: "s" | "m" | "l" = "m";

  /** The component's theme. */
  @Prop({ reflect: true, mutable: true }) theme: "light" | "dark" = "light";

  @Event() calciteSwitchChange: EventEmitter;
  @Event() change: EventEmitter;

  private observer: MutationObserver;

  @Listen("click") onClick(e) {
    // prevent duplicate click events that occur
    // when the component is wrapped in a label and checkbox is clicked
    if (
      (this.el.closest("label") && e.target === this.inputProxy) ||
      (!this.el.closest("label") && e.target === this.el)
    ) {
      this.updateSwitch(e);
    }
  }

  @Listen("keydown") keyDownHandler(e: KeyboardEvent) {
    if (e.keyCode === SPACE || e.keyCode === ENTER) {
      this.updateSwitch(e);
    }
  }

  @Watch("switched") switchWatcher() {
    this.switched
      ? this.inputProxy.setAttribute("checked", "")
      : this.inputProxy.removeAttribute("checked");
  }

  private inputProxy: HTMLInputElement;

  connectedCallback() {
    // prop validations
    let theme = ["light", "dark"];
    if (!theme.includes(this.theme)) this.theme = "light";

    let color = ["blue", "red"];
    if (!color.includes(this.color)) this.color = "blue";

    let scale = ["s", "m", "l"];
    if (!scale.includes(this.scale)) this.scale = "m";
    this.setupProxyInput();
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  componentWillRender() {
    this.syncProxyInputToThis();
  }

  render() {
    return (
      <Host
        role="checkbox"
        aria-checked={this.switched.toString()}
        tabIndex={this.tabIndex}
      >
        <div class="track">
          <div class="handle" />
        </div>
      </Host>
    );
  }

  private get tabIndex(): number {
    const hasTabIndex = this.el.hasAttribute("tabindex");

    if (hasTabIndex) {
      return Number(this.el.getAttribute("tabindex"));
    }

    return 0;
  }

  private setupProxyInput() {
    // check for a proxy input
    this.inputProxy = this.el.querySelector("input");

    // if the user didn't pass a proxy input create one for them
    if (!this.inputProxy) {
      this.inputProxy = document.createElement("input");
      this.inputProxy.type = "checkbox";
      this.syncProxyInputToThis();
      this.el.appendChild(this.inputProxy);
    }

    this.syncThisToProxyInput();
    if (Build.isBrowser) {
      this.observer = new MutationObserver(this.syncThisToProxyInput);
      this.observer.observe(this.inputProxy, { attributes: true });
    }
  }

  private syncThisToProxyInput = () => {
    this.switched = this.inputProxy.hasAttribute("checked");
    this.name = this.inputProxy.name;
    this.value = this.inputProxy.value;
  };

  private syncProxyInputToThis = () => {
    this.switched
      ? this.inputProxy.setAttribute("checked", "")
      : this.inputProxy.removeAttribute("checked");
    this.inputProxy.setAttribute("name", this.name);
    this.inputProxy.setAttribute("value", this.value);
  };
  private updateSwitch(e) {
    e.preventDefault();
    this.switched = !this.switched;
    this.change.emit();
    this.calciteSwitchChange.emit();
  }
}
