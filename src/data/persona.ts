export interface Persona {
  name: string;
  age: number;
  occupation: string;
  income: string;
  location: string;
  creditScore: number;
  family: {
    wife: number;
    daughters: { name: string; age: number }[];
    pet: string;
  };
}

export const persona: Persona = {
  name: "Shinji Fujiwara",
  age: 42,
  occupation: "VP of Engineering at Stripe",
  income: "$180,000/year",
  location: "Palo Alto, CA",
  creditScore: 780,
  family: {
    wife: 40,
    daughters: [
      { name: "Sakura", age: 10 },
      { name: "Hana", age: 8 },
    ],
    pet: "Cocoa (toy poodle)",
  },
};
