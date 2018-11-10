import { types, Instance } from "mobx-state-tree";
import { TimeTraveller } from "mst-middlewares";
import BoxModel from "../Box/model";

const GridModel = types
  .model("grid", {
    boxes: types.map(BoxModel),
    history: types.optional(TimeTraveller, { targetPath: "../boxes" }),
    password: "",
    input: "",
    loggedIn: false,
    unsucessfulLogIn: false
  })
  .actions(self => {
    const clean = () => {
      Array.from(self.boxes.values()).forEach(box => (box.emoji = null));

      const clickedBox = Array.from(self.boxes.values()).find(
        box => box.clicked
      );
      if (clickedBox) {
        clickedBox.click(false);
      }

      self.loggedIn = false;
      self.unsucessfulLogIn = false;
    };

    return {
      addBox(box: Instance<typeof BoxModel>) {
        self.boxes.set(box.id, box);
      },

      setInput(input: string) {
        self.input = input;
      },

      setPassword() {
        self.password = self.input;
        clean();
      },

      login() {
        self.loggedIn = self.password === self.input;

        if (!self.loggedIn) {
          self.unsucessfulLogIn = true;
        }
      },

      clean,

      reset() {
        clean();
        self.password = "";
      },

      undo() {
        if (self.history.canUndo) {
          self.history.undo();
        }
      }
    };
  })
  .views(self => ({
    get boxClicked() {
      return Array.from(self.boxes.values()).find(box => box.clicked);
    },

    get boxesFilled() {
      return Array.from(self.boxes.values()).filter(box => box.emoji);
    },

    get isLocked() {
      return self.password !== self.input;
    },

    get isUnlocked() {
      return self.password === self.input;
    }
  }));

export default GridModel;
