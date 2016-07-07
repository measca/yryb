'use strict'

module.exports = (data) => {
  data.body = [
    {
      title: '未联系',
      color: 'danger'
    },
    {
      title: '非意向',
      color: 'default'
    },
    {
      title: '意向',
      color: 'warning'
    },
    {
      title: '洽谈',
      color: 'info'
    },
    {
      title: '开发中',
      color: 'success'
    },
    {
      title: '待收款',
      color: 'info',
    },
    {
      title: '合作结束',
      color: 'default'
    }
  ];
}
