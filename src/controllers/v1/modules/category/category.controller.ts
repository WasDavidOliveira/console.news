import { Request, Response } from 'express';
import { CategoryService } from '@/services/v1/modules/category/category.service';
import { StatusCode } from '@/constants/status-code.constants';

export class CategoryController {
  protected categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  show = async (req: Request, res: Response) => {
    const categories = await this.categoryService.show();

    res.status(StatusCode.OK).json({
      message: 'Categorias encontradas com sucesso.',
      data: categories,
    });
  };

  findById = async (req: Request, res: Response) => {
    const category = await this.categoryService.findById(Number(req.params.id));

    res.status(StatusCode.OK).json({
      message: 'Categoria encontrada com sucesso.',
      data: category,
    });
  };

  create = async (req: Request, res: Response) => {
    const category = await this.categoryService.create(req.body);

    res.status(StatusCode.CREATED).json({
      message: 'Categoria criada com sucesso.',
      data: category,
    });
  };

  update = async (req: Request, res: Response) => {
    const category = await this.categoryService.update(
      Number(req.params.id),
      req.body,
    );

    res.status(StatusCode.OK).json({
      message: 'Categoria atualizada com sucesso.',
      data: category,
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.categoryService.delete(Number(req.params.id));

    res.status(StatusCode.OK).json({
      message: 'Categoria removida com sucesso.',
    });
  };
}

export default new CategoryController();
