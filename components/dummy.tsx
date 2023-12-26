"use client";

export function DummyComponent({ data }) {
  
  const d = data[0];

  const date = new Date(d["Expiry Date"] + "T00:00:00.000Z");

  console.log(date);
  return (<></>)
}