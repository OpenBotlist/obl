import Core from '../core.js';

const Task = {};

Task.Create = async (name, fn) => {
  console.log("[Task] > " + name);
  //Core.Logger.log("[Task] > " + name);
  try {
    await fn();
  } catch(error) {
    console.log("[Task] ERROR:", error);
    Core.Logger.log("[Task] ERROR " + name);
    return;
  }
  console.log("[Task] Complete " + name);
  //Core.Logger.log("[Task] Complete " + name);
}

export default Task;