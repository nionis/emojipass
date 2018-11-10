import * as React from "react";
import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import { Emoji } from "emoji-mart";
import { BaseEmoji } from "emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index";
import BoxModel from "./model";
import GridModel from "../Grid/model";
import { boxStyle } from "./style";

interface IBox {
  store: Instance<typeof BoxModel>;
  gridStore: Instance<typeof GridModel>;
  children?: React.ReactChild;
  style?: React.CSSProperties;
}

@observer
class Box extends React.Component<IBox> {
  public props: IBox;

  constructor(props: IBox) {
    super(props);
    this.props = props;
  }

  private clicked = () => {
    if (this.props.gridStore.boxClicked) {
      this.props.gridStore.boxClicked.click(false);
    }
    this.props.store.click(true);
  };

  public render() {
    const { store, children, style } = this.props;
    const emoji = { id: String(store.emoji) } as BaseEmoji;

    return (
      <div
        onClick={this.clicked}
        style={{
          gridColumnStart: store.column,
          gridColumnEnd: store.column,
          gridRowStart: store.row,
          gridRowEnd: store.row,
          ...boxStyle(),
          ...style
        }}
      >
        {store.emoji ? <Emoji emoji={emoji} size={32} /> : null}
        {children}
      </div>
    );
  }
}

export default Box;
