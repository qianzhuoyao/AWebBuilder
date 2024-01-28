import { Component } from "react";
import * as React from "react";
import Scene from "scenejs";
import "./Rule.css";
import Guides from "@scena/react-guides";
import { ref } from "framework-utils";
import Gesto from "gesto";
import { AScene } from "./operation";

interface State {
  lockAdd: boolean;
  lockRemove: boolean;
  lockChange: boolean;
  unit: number;
  horizontalZoom: number;
  verticalZoom: number;
}

export default class ARuler extends Component<{}> {
  public state: State = {
    horizontalZoom: 1,
    verticalZoom: 1,
    unit: 37.7,
    lockAdd: false,
    lockChange: false,
    lockRemove: false,
  };
  private scene: Scene = new Scene();
  // private editor!: Editor;
  private guides1: Guides;
  private guides2: Guides;
  private scrollX: number = 0;
  private scrollY: number = 0;

  private handleLockRemoveClick = () => {
    const lockRemove = !this.state.lockRemove;

    this.setState({ lockRemove });
  };

  private handleLockAddClick = () => {
    const lockAdd = !this.state.lockAdd;
    this.setState({ lockAdd });
  };

  private handleLockChangeClick = () => {
    const lockChange = !this.state.lockChange;
    const lockRemove = !this.state.lockRemove && true;
    this.setState({ lockChange, lockRemove });
  };

  private handleLockToggleClick = () => {
    this.setState({ lockAdd: false, lockRemove: false, lockChange: false });
  };

  public render() {
    const lockGuides: Array<"add" | "change" | "remove"> = [];
    if (this.state.lockAdd) {
      lockGuides.push("add");
    }
    if (this.state.lockChange) {
      lockGuides.push("change");
    }
    if (this.state.lockRemove) {
      lockGuides.push("remove");
    }
    const lockText = lockGuides.length ? "unlock" : "lock";
    const isLockButtonActive = (lockType: boolean) =>
      lockType && { background: "#333", color: "#fff" };
    return (
      <div className="page h-full relative">
        <div className="box" onClick={this.restore}></div>
        <Guides
          ref={ref(this, "guides1")}
          type="horizontal"
          zoom={1}
          unit={50}
          lockGuides={lockGuides}
          snapThreshold={5}
          textFormat={(v) => `${v}px`}
          snaps={[1, 2, 3]}
          digit={1}
          style={{ height: "30px", width: "calc(100%px)" }}
          rulerStyle={{
            left: "30px",
            width: "calc(100% - 30px)",
            height: "100%",
          }}
          dragPosFormat={(v) => `${v}px`}
          displayDragPos={true}
          displayGuidePos={true}
          guidesOffset={50}
          onChangeGuides={({ guides }) => {
            console.log("horizontal", guides);
          }}
          onDragStart={(e) => {
            console.log("dragStart", e);
          }}
          onDrag={(e) => {
            console.log("drag", e);
          }}
          onDragEnd={(e) => {
            console.log("dragEnd", e);
          }}
          onClickRuler={(e) => {
            console.log("?", e);
          }}
        />
        <Guides
          ref={ref(this, "guides2")}
          type="vertical"
          zoom={1}
          unit={50}
          font="10px"
          lockGuides={lockGuides}
          snapThreshold={5}
          textFormat={(v) => `${v}px`}
          snaps={[1, 2, 3]}
          digit={1}
          rulerStyle={{
            height: "calc(100%)",
            width: "100%",
          }}
          style={{ width: "30px", height: "calc(100% - 30px)" }}
          dragPosFormat={(v) => `${v}px`}
          displayDragPos={true}
          displayGuidePos={true}
          guidesOffset={50}
          onChangeGuides={({ guides }) => {
            console.log("horizontal", guides);
          }}
          onDragStart={(e) => {
            console.log("dragStart", e);
          }}
          onDrag={(e) => {
            console.log("drag", e);
          }}
          onDragEnd={(e) => {
            console.log("dragEnd", e);
          }}
          onClickRuler={(e) => {
            console.log("?", e);
          }}
        
        />
        <AScene></AScene>
      </div>
    );
  }

  public componentDidMount() {
    new Gesto(document.body).on("drag", (e) => {
      this.scrollX -= e.deltaX;
      this.scrollY -= e.deltaY;

      this.guides1.scrollGuides(this.scrollY);
      this.guides1.scroll(this.scrollX);

      this.guides2.scrollGuides(this.scrollX);
      this.guides2.scroll(this.scrollY);
      console.log(this.guides2,'e-e')
    });
    window.addEventListener("resize", () => {
      this.guides1.resize();
      this.guides2.resize();
    });
  }
  public restore = () => {
    this.scrollX = 0;
    this.scrollY = 0;
    this.guides1.scroll(0);
    this.guides1.scrollGuides(0);
    this.guides2.scroll(0);
    this.guides2.scrollGuides(0);
  };
}

Object.defineProperty(Array.prototype, "remove", {
  value: function (value) {
    for (let key in this) {
      if (this[key] === value) {
        this.splice(key, 1);
      }
    }
    return this;
  },
});
