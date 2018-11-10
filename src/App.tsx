import * as React from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import Grid from "./components/Grid";
import GridModel from "./components/Grid/model";
import BoxModel from "./components/Box/model";

@observer
class App extends React.Component {
  private gridStore: Instance<typeof GridModel>;

  constructor(props: any) {
    super(props);

    // create grid store
    this.gridStore = GridModel.create({});

    // create boxes
    const rows = 4;
    const columns = 4;

    const boxes = Array.from(Array(rows)).reduce((all, a, rowIndex) => {
      const list = Array.from(Array(columns)).map((b, colIndex) => {
        const row = rowIndex + 1;
        const column = colIndex + 1;

        return BoxModel.create({
          id: `${row}-${column}`,
          row,
          column
        });
      });

      all = all.concat(list);

      return all;
    }, []) as any[];

    // add boxes to gridStore
    boxes.forEach(this.gridStore.addBox);

    // update input
    autorun(() => {
      const input = boxes.reduce((str, box: any) => {
        str += box.emoji || "0";

        return str;
      }, "");

      this.gridStore.setInput(input);
    });
  }

  private pickerClicked = (emoji: any, event: any) => {
    if (!this.gridStore.boxClicked) {
      return;
    }

    this.gridStore.boxClicked.setEmoji(emoji.id);
  };

  public render() {
    if (this.gridStore.loggedIn) {
      return (
        <img
          src="loggedIn.jpg"
          onClick={this.gridStore.reset}
          style={{ width: "100%" }}
        />
      );
    }

    return (
      <div>
        <>
          <h3 style={{ margin: "0px" }}>Emoji pass proof of concept</h3>
          <br />
          set minimum 4 emoticons
        </>
        <hr />
        <>
          backend info:
          <br />
          set password: {this.gridStore.password || "none"}
          <br />
          input password: {this.gridStore.input}
          <br />
          unlocked: {this.gridStore.isUnlocked.toString()}
        </>
        <hr />
        <>
          actions
          <br />
          {this.gridStore.password.length === 0 ? (
            <button
              onClick={this.gridStore.setPassword}
              disabled={this.gridStore.boxesFilled.length < 4}
            >
              set as password
            </button>
          ) : (
            <button
              onClick={this.gridStore.login}
              disabled={this.gridStore.boxesFilled.length < 4}
            >
              login
            </button>
          )}
          <button onClick={this.gridStore.clean}>clean</button>
          <button onClick={this.gridStore.reset}>reset</button>
          {this.gridStore.unsucessfulLogIn ? "wrong emoji pass" : null}
        </>
        <hr />
        <>
          <Grid store={this.gridStore} />
          <Picker
            set="apple"
            onClick={this.pickerClicked}
            recent={[""]}
            showSkinTones={false}
            title="Pick your emoji…"
            emoji="point_up"
          />
        </>
      </div>
    );
  }
}

export default App;
