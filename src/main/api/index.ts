import "../config/module-alias";
import { PersonController } from "@/application/controllers";

const person = new PersonController();
person.speak("TypeScript"); // Olá TYPESCRIPT!
person.speak(); // Olá mundo!
