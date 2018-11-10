import * as React from "react";
import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import GridModel from "./model";
import Box from "../Box";
import { containerStyle } from "./style";

interface IGrid {
  store: Instance<typeof GridModel>;
}

@observer
class Grid extends React.Component<IGrid> {
  public props: IGrid;

  constructor(props: IGrid) {
    super(props);
    this.props = props;
  }

  public render() {
    const { store } = this.props;
    const boxes = Array.from(store.boxes.values());

    return (
      <div style={containerStyle()}>
        {boxes.map((box: any) => {
          const style = {} as React.CSSProperties;
          if (
            this.props.store.boxClicked &&
            this.props.store.boxClicked.id === box.id
          ) {
            style.border = "1px solid red";
          }

          return (
            <Box
              store={box}
              gridStore={this.props.store}
              key={box.id}
              style={style}
            />
          );
        })}
      </div>
    );
  }
}

export default Grid;
