import * as anchor from "@coral-xyz/anchor"
import idl from "./idl/simple_counter.json"
import { Connection, PublicKey } from "@solana/web3.js"


const PROGRAM_ID = new PublicKey(idl.address);
const CLUSTER_URL = "http://127.0.0.1:8899";

const walletBtn = document.querySelector("#connect-wallet");
const initializeBtn = document.querySelector("#initialize-counter");
const incrementBtn = document.querySelector("#increment-counter");

let publicKey = null;
let provider = null;
let program = null;

//Connect Wallet
walletBtn.addEventListener('click', async function () {
  if (!window.solana) {
    console.log("Wallet not detected.");
    return;
  }

  try {
    //Request connection from wallet
    const response = await window.solana.connect();
    publicKey = response.publicKey;

    //Create Solana connection
    const connection = new Connection(CLUSTER_URL, "confirmed");

    //Create Anchor Provider
    provider = new anchor.AnchorProvider(connection, window.solana, { preflightCommitment: "confirmed" });

    //Create Program Instance
    program = new anchor.Program(idl, provider);


    console.log("Connected Successfully!")
  }
  catch (err) {
    console.log("Connection error: ", err)
  }
})

//Update Counter - Fetch the current value from the blockchain
async function updateCounter() {
  if (!program || !publicKey) {
    console.log("Program or wallet not connected.");
    return;
  }

  try {
    // Derive the counter PDA
    const [counterPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("counter"), publicKey.toBuffer()],
      PROGRAM_ID
    );

    // Fetch the counter account
    const counterAccount = await program.account.counter.fetch(counterPDA);

    // Update the UI
    const counterValueElement = document.querySelector("#counter-value");
    counterValueElement.textContent = counterAccount.count.toString();

    console.log("Counter updated:", counterAccount.count.toString());
  }
  catch (err) {
    console.log("Error fetching counter:", err);
  }
}

//Initialize Instruction
initializeBtn.addEventListener('click', async function () {
  if (!program) return;

  try {
    //Create transaction 
    const txn = await program.methods
      .initialize()
      .accounts({
        user: publicKey,
      })
      .rpc()

    console.log("Transaction created and sent successfully!");

    // Update the counter display after initialization
    await updateCounter();
  }
  catch (err) {
    console.log("Error creating/sending transaction: ", err);
  }
})


//Increment Instruction
incrementBtn.addEventListener('click', async function () {
  if (!program) return;

  try {
    //Create transaction 
    const txn = await program.methods
      .increment()
      .accounts({
        authority: publicKey,
      })
      .rpc()

    console.log("Transaction created and sent successfully!");

    // Update the counter display after increment
    await updateCounter();
  }
  catch (err) {
    console.log("Error creating/sending transaction: ", err);
  }
})
