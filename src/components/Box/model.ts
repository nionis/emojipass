import { types } from "mobx-state-tree";

const Model = types
  .model("box", {
    id: types.identifier,
    row: types.number,
    column: types.number,
    emoji: types.maybeNull(types.string),
    clicked: false
  })
  .actions(self => ({
    setEmoji(emoji: string) {
      self.emoji = emoji;
    },

    click(clicked: boolean) {
      self.clicked = clicked;
    }
  }));

export default Model;
