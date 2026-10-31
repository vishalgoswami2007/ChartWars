const CH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const gen = () => Array.from({ length: 6 }, () => CH[Math.floor(Math.random() * CH.length)]).join("");

export default async function uniqueCode(Room) {
  for (let i = 0; i < 5; i++) {
    const c = gen();
    if (!(await Room.exists({ code: c }))) return c;
  }
  throw new Error("Code generate nahi hua");
}