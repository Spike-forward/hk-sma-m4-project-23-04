import * as bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

//PlainText -> Hashed Password
export async function hashPassword(plainPassword: string) {
  const hash: string = await bcrypt.hash(plainPassword, SALT_ROUNDS)
  return hash
}


//PlainPassword-> 幫你check下同入面hashed password係咪同一個
export async function checkPassword(plainPassword:string,hashPassword:string){
  const match = await bcrypt.compare(plainPassword,hashPassword);
  return match
}