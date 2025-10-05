const ROLE_FLAGS = [
  { flag: 'isAdmin', role: 'admin' },
  { flag: 'isCashier', role: 'cashier' },
  { flag: 'isFinanceManager', role: 'financial manager' },
  { flag: 'isFinancialManager', role: 'financial manager' },
  { flag: 'isLogisticManager', role: 'logistic manager' },
  { flag: 'isStaffManager', role: 'staff manager' },
  { flag: 'isTrainingCoordinator', role: 'training coordinator' },
];

function getUserRole(user) {
  if (!user) {
    return 'user';
  }

  for (const { flag, role } of ROLE_FLAGS) {
    if (user[flag]) {
      return role;
    }
  }

  return 'user';
}

module.exports = { getUserRole };
