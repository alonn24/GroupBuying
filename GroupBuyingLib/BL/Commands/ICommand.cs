using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroupBuyingLib.BL.Commands
{
    interface ICommand<T>
    {
        T Result { get; }
        void execute();
    }
}
