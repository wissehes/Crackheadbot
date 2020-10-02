<template>
  <div>
    <div v-if="!loading">
      <div v-for="group in groups" :key="group.id">
        <h2>{{ group.name }}</h2>
        <Command
          v-for="command in group.commands"
          :key="command.name"
          :command="command"
        />
      </div>
    </div>
    <div v-else>
      <p>
        <b> Loading... </b>
      </p>
    </div>
    <span v-if="error" class="error">
      An error occurred while fetching the commands list!
    </span>
  </div>
</template>

<script>
import Command from "./Command";

export default {
  data: () => ({
    loading: true,
    error: false,
    commands: [],
    groups: [],
  }),
  components: {
    Command,
  },
  mounted() {
    fetch("https://crackheadbot.wissehes.nl/api/commands")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else throw new Error(response);
      })
      .then((commands) => {
        this.loading = false;

        commands.forEach((command) => {
          let foundGroup = this.groups.find((a) => a.id == command.groupID);
          if (foundGroup) {
            foundGroup.commands.push(command);
          } else {
            this.groups.push({
              name: command.group,
              id: command.groupID,
              commands: [command],
            });
          }
        });
        console.log(this.groups);

        this.commands = commands;
      })
      .catch((a) => (this.error = true));
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>