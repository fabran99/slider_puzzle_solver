var solved_state = [];
for (let i = 0; i < 8; i++) {
  solved_state.push(i + 1);
}
solved_state.push("hueco");
solved_state = solved_state.join("_");

class GraphHandler {
  constructor() {
    this.solved_state = solved_state;
    this.parents = {
      [solved_state]: null,
    };
    this.levels = {
      [solved_state]: 0,
    };
    this.max_level_states = [solved_state];
    this.max_level = 0;
  }

  initSearch(final_state) {
    var current_level_states = this.max_level_states;
    var found = false;
    var current_state;
    var next_states;
    var next_level_states = [];
    var total_pasos = 0;
    var state;
    while (!found) {
      for (let i = 0; i < current_level_states.length; i++) {
        current_state = current_level_states[i];
        next_states = this.detectNextStates(current_state);
        for (let k = 0; k < next_states.length; k++) {
          state = next_states[k];

          if (!(state in this.parents)) {
            //console.log(state)
            this.parents[state] = current_state;
            this.levels[state] = this.max_level + 1;
            if (state == final_state) {
              found = true;
              console.log(`Encontrado en minimo ${this.levels[state]} pasos`);
              break;
            }
            next_level_states.push(state);
            console.log(
              `pasos totales ${total_pasos}, nivel ${this.levels[state]},${
                Object.keys(this.parents).length
              } opciones`
            );
          }
          total_pasos++;
        }
      }
      current_level_states = next_level_states;
      this.max_level_states = current_level_states;
      this.max_level++;
      next_level_states = [];
    }
  }

  getRoute(state) {
    var next = this.parents[state];
    var route = [];
    console.log(next);
    while (next) {
      route.push(next);
      next = this.parents[next];
    }
    return route;
  }

  detectNextStates(state) {
    state = state.split("_");
    var blank_space = state.indexOf("hueco");
    var pos_hueco = blank_space + 1;
    var row = Math.ceil(pos_hueco / 3);
    var col = pos_hueco - (row - 1) * 3;

    var allowedMovements = {
      left: col + 1 <= 3,
      right: col - 1 > 0,
      down: row - 1 > 0,
      up: row + 1 <= 3,
    };

    var movementIndexes = {};

    if (allowedMovements.right) {
      movementIndexes.right = blank_space - 1;
    }
    if (allowedMovements.left) {
      movementIndexes.left = blank_space + 1;
    }
    if (allowedMovements.up) {
      movementIndexes.up = blank_space + 3;
    }
    if (allowedMovements.down) {
      movementIndexes.down = blank_space - 3;
    }

    var next_state_list = [];
    for (let arrow in allowedMovements) {
      if (allowedMovements[arrow]) {
        next_state_list.push(
          this.generateMovement(state, blank_space, movementIndexes[arrow])
        );
      }
    }

    return next_state_list;
  }

  generateMovement(state, blank_space, movement_position) {
    var state_copy = state.map((x) => x);
    state_copy[blank_space] = state_copy[movement_position];
    state_copy[movement_position] = "hueco";
    return state_copy.join("_");
  }
}

var gh = new GraphHandler();
var current_state = "1_2_5_4_3_8_6_hueco_7";
gh.initSearch(current_state);
//console.log(gh.parents[solved_state])
console.log(gh.getRoute(current_state));
