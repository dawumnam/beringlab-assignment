import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isStrongPassword", async: false })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string) {
    let criteriaCount = 0;

    if (/[a-z]/.test(password)) criteriaCount++;

    if (/[A-Z]/.test(password)) criteriaCount++;

    if (/\d/.test(password)) criteriaCount++;

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      criteriaCount++;
    }

    return criteriaCount >= 3;
  }

  defaultMessage() {
    return "Password must meet at least 3 of the following criteria: lowercase, uppercase, number, or symbol";
  }
}
