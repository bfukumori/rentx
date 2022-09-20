import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { password, old_password } = request.body;
    const createUserUseCase = container.resolve(UpdateUserUseCase);

    const user = await createUserUseCase.execute({
      id: user_id,
      password,
      old_password,
    });

    return response.status(201).json(user);
  }
}

export { UpdateUserController };
