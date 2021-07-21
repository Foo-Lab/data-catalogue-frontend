import React from 'react';
import { Table } from 'antd';

import ContentHeader from '../../components/ContentHeader';
import TableActions from '../../components/TableActions';

const Experiments = () => {
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => new Date(b.date) - new Date(a.date),
            onFilter: (value, record) => record.name.indexOf(value) === 0,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            sorter: (a, b) => a.code > b.code,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name > b.name,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            ellipsis: true,
            width: '40%',
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            width: 110,
            render: (id) => {
                return <TableActions id={id}/>
            },
          },
    ];

    const data = [
        {
            id: 1,
            user_id: 1,
            date: '01-01-2021',
            code: 'EH001',
            name: 'Human genome exp',
            description: 'Lorem ipsum',
        },
        {
            id: 2,
            user_id: 1,
            date: '01-02-2021',
            code: 'EM001',
            name: 'Mouse mm10 genome exp',
            description: 'Get video posted to internet for chasing red dot fooled again thinking the dog likes me ooooh feather moving feather! but touch my tail, i shred your hand purrrr do doodoo in the litter-box, clickityclack on the piano, be frumpygrumpy. More napping, more napping all the napping is exhausting. Relentlessly pursues moth always ensure to lay down in such a manner that tail can lightly brush humans nose or ears back wide eyed cat slap dog in face. I bet my nine lives on you-oooo-ooo-hooo. Try to jump onto window and fall while scratching at wall one of these days Im going to get that red dot, just you wait and see play with twist ties roll over and sun my belly, walk on car leaving trail of paw prints on hood and windshield. Touch water with paw then recoil in horror. Poop in litter box, scratch the walls. Do i like standing on litter cuz i sits when i have spaces, my cat buddies have no litter i live in luxury cat life when owners are asleep, cry for no apparent reason kitty pounce, trip, faceplant you didnt see that no you didnt definitely didnt lick, lick, lick, and preen away the embarrassment. Commence midnight zoomies. Make plans to dominate world and then take a nap i like cats because they are fat and fluffy hiiiiiiiiii feed me now and meowing chowing and wowing murr i hate humans they are so annoying. Bite nose of your human good now the other hand, too and wake up wander around the house making large amounts of noise jump on top of your humans bed and fall asleep again yet chase imaginary bugs, for let me in let me out let me in let me out let me in let me out who broke this door anyway but being gorgeous with belly side up cat not kitten around . Meoooow i can haz lick human with sandpaper tongue, lick plastic bags.',
        },
    ];


    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className='content-page'>
            <ContentHeader name='Experiments' />
            <Table
                columns={columns}
                dataSource={data}
                onChange={onChange}
            />
        </div>

    );
};

export default Experiments;
