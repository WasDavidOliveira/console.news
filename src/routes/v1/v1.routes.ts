import { Router } from 'express';
import authRoutes from '@/routes/v1/modules/auth/auth.routes';
import permissionRoutes from '@/routes/v1/modules/permission/permission.routes';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import rolePermissionRoutes from '@/routes/v1/modules/role-permission/role-permission.routes';
import roleRoutes from '@/routes/v1/modules/role/roles.routes';
import categoryRoutes from '@/routes/v1/modules/category/category.routes';
import templateRoutes from '@/routes/v1/modules/template/template.routes';
import healthRoutes from '@/routes/v1/modules/health/health.routes';
import subscriptionRoutes from '@/routes/v1/modules/subscription/subscription.routes';
import { hasRole } from '@/middlewares/authorization/role.middleware';

const router: Router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/permissions', authMiddleware, permissionRoutes);
router.use('/roles', authMiddleware, roleRoutes);
router.use('/roles-permissions', authMiddleware, rolePermissionRoutes);
router.use('/categories', authMiddleware, hasRole('admin'), categoryRoutes);
router.use('/templates', authMiddleware, hasRole('admin'), templateRoutes);

export default router;
