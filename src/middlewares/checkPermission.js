import { db } from '../models/index.js';

export const checkPermission = (requiredAction, resourceName) => {
  return async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const roles = await db.UserRole.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Role,
          as: 'role',
          include: [
            {
              model: db.Permission,
              as: 'permissions',
              include: [{ model: db.Resource, as: 'resource' }],
            },
          ],
        },
      ],
    });
    //  console.log("req.user----------", req.user);
    // 🟡 DEBUG: log what permissions the user actually has
    const allPerms = roles.flatMap((userRole) =>
      userRole.role.permissions.map(
        (perm) => `${perm.resource.name}:${perm.action}`
      )
    );

    console.log('🔍 User Permissions:', allPerms);
    console.log('🔍 Required:', `${resourceName}:${requiredAction}`);

    const normalize = (str) => str?.toLowerCase().replace(/s$/, '');
    const hasPermission = roles.some((userRole) =>
      userRole.role.permissions.some(
        (perm) =>
          normalize(perm.action) === normalize(requiredAction) &&
          normalize(perm.resource.name) === normalize(resourceName)
      )
    );

    if (!hasPermission) {
      console.warn(
        `🚫 Access denied: User ${userId} missing ${requiredAction} on ${resourceName}`
      );
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};
