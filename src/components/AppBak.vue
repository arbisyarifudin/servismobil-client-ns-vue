<template>
  <Page>
    <ActionBar title="NativeScript-Vue TODO APP" />
    <TabView
      height="100%"
      androidTabsPosition="bottom"
      selectedTabTextColor="#53ba82"
      tabTextColor="#ddd"
      tabBackgroundColor="#fff"
      tabTextFontSize="17"
      androidSelectedTabHighlightColor="#53ba82"
    >
      <TabViewItem title="To Do">
        <StackLayout orientation="vertical" width="100%" height="100%">
          <GridLayout columns="2*,*" rows="*" width="100%" height="20%">
            <TextField
              col="0"
              row="0"
              v-model="textFieldValue"
              hint="Type new task..."
              editable="true"
              @returnPress="onButtonTap"
            />
            <Button col="1" row="0" text="Add task" @tap="onButtonTap" />
          </GridLayout>
          <ListView
            class="list-group"
            for="todo in todos"
            @itemTap="onItemTap"
            style="height: 80%"
          >
            <v-template>
              <Label
                :text="todo.name"
                class="list-group-item-heading"
                textWrap="true"
              />
            </v-template>
          </ListView>
        </StackLayout>
      </TabViewItem>

      <TabViewItem title="Completed">
        <ListView
          class="list-group"
          for="done in dones"
          @itemTap="onDoneTap"
          style="height: 75%"
        >
          <v-template>
            <Label
              :text="done.name"
              class="list-group-item-heading"
              textWrap="true"
            />
          </v-template>
        </ListView>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script >
export default {
  data() {
    return {
      msg: "Hallo TRAINIT!",
      textFieldValue: "",
      todos: [],
      dones: [],
    };
  },
  methods: {
    onButtonTap() {
      if (!this.textFieldValue) return;
      this.todos.unshift({ name: this.textFieldValue });
      this.textFieldValue = "";
    },
    onItemTap(args) {
      console.log("Item with index: " + args.index + " tapped");
      action("What do you want to do with this task?", "Cancel", [
        "Mark completed",
        "Delete forever",
      ]).then((result) => {
        console.log(result); // Logs the selected option for debugging.
        switch (result) {
          case "Mark completed":
            this.dones.unshift(args.item); // Places the tapped active task at the top of the completed tasks.
            this.todos.splice(args.index, 1); // Removes the tapped active  task.
            break;
          case "Delete forever":
            this.todos.splice(args.index, 1); // Removes the tapped active task.
            break;
          case "Cancel" || undefined: // Dismisses the dialog
            break;
        }
      });
    },
    onDoneTap: function (args) {
      action("What do you want to do with this task?", "Cancel", [
        "Mark to do",
        "Delete forever",
      ]).then((result) => {
        console.log(result); // Logs the selected option for debugging.
        switch (result) {
          case "Mark to do":
            this.todos.unshift(args.item); // Places the tapped completed task at the top of the to do tasks.
            this.dones.splice(args.index, 1); // Removes the tapped completed task.
            break;
          case "Delete forever":
            this.dones.splice(args.index, 1); // Removes the tapped completed task.
            break;
          case "Cancel" || undefined: // Dismisses the dialog
            break;
        }
      });
    },
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
TextField {
  font-size: 20;
  color: #53ba82;
  margin-top: 10;
  margin-bottom: 10;
  margin-right: 5;
  margin-left: 20;
  height: 40;
  placeholder-color: #c1c1c1;
}
Button {
  font-size: 20;
  font-weight: bold;
  color: white;
  background-color: #53ba82;
  height: 40;
  margin-top: 10;
  margin-bottom: 10;
  margin-right: 10;
  margin-left: 10;
  border-radius: 20px;
}
</style>
