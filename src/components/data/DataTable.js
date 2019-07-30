import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import {Table, Button, Icon, Modal, Dropdown, Menu, message, Alert} from 'antd';

import {CRUDContext} from '../../contexts/data/CRUDContext';
import LoadingProgress from '../LoadingProgress';


const DEFAULT_MODAL_WIDTH = 600;

const ActionsDropdown = (props) => {
    const {actions} = props;

    return <Dropdown
        placement='bottomRight'
        overlay={
            <Menu>
                {actions.filter(action => !action.hidden).map(action => {
                    const LinkTag = action.href ? Link : 'a';

                    return <Menu.Item key={action.key}>
                        <LinkTag to={action.href} onClick={action.onClick}>
                            {action.icon && <span className={'action-icon-wrapper'}>{action.icon}</span>}
                            {action.label}
                        </LinkTag>
                    </Menu.Item>
                })}
            </Menu>
        }
    >
        <Button className='actions-button' shape='circle'>
            <Icon type='ellipsis' theme='outlined'/>
        </Button>
    </Dropdown>;
};


/**
 * Inner table.
 * @param props
 * @returns {*}
 * @constructor
 */
const InnerTable = (props) => {
    const crudContext = useContext(CRUDContext);
    const {rows, fetching} = crudContext.state;
    const {columns, actions, rowKey, pagination, onUpdateClick, onDeleteClick, fetchingParams} = props;

    let configuredColumns;
    let paginationConfig;

    if (pagination === undefined) {
        paginationConfig = {
            pageSize: 30
        };
    } else {
        paginationConfig = pagination;
    }

    const getActionsDropdown = (record) => {
        const preparedActions = actions.map((action) => {
            const preparedAction = {...action};
            const href = typeof preparedAction.href === 'function'
                ? preparedAction.href(record)
                : preparedAction.href;
            const {onClick} = preparedAction;

            if (onClick) {
                preparedAction.onClick = () => {
                    onClick(record);
                }
            }

            if (!preparedAction.label) {
                if (preparedAction.type === 'update') {
                    preparedAction.label = 'Update';
                    if (!preparedAction.icon) {
                        preparedAction.icon = <Icon type={'edit'}/>;
                    }
                    preparedAction.onClick = () => {
                        onUpdateClick(record);
                    }
                }
                if (preparedAction.type === 'delete') {
                    preparedAction.label = 'Delete';
                    if (!preparedAction.icon) {
                        preparedAction.icon = <Icon type={'delete'}/>;
                    }
                    preparedAction.onClick = () => {
                        onDeleteClick(record);
                    }
                }
            }

            return {
                key: preparedAction.type,
                ...preparedAction,
                href,
            }
        });
        return <ActionsDropdown actions={preparedActions}/>;
    };

    useEffect(() => {
        crudContext.actions.fetch({requestConfig: {params: fetchingParams ? fetchingParams : undefined}});
    }, [fetchingParams]);

    if (actions) {
        configuredColumns = [...columns, {
            title: 'Actions',
            width: 100,
            align: 'center',
            render: (text, record, index) => {
                return getActionsDropdown(record);
            }
        }];
    } else {
        configuredColumns = [...columns];
    }

    return <Table loading={fetching}
                  pagination={paginationConfig}
                  rowKey={rowKey ? rowKey : 'id'}
                  columns={configuredColumns}
                  dataSource={rows}/>;
};
InnerTable.propTypes = {
    columns: PropTypes.array.isRequired,
    actions: PropTypes.array,
    pagination: PropTypes.bool,
    fetchingParams: PropTypes.object
};


/**
 * Various modals.
 * @param props
 * @returns {*}
 * @constructor
 */
const DataModal = (props) => {
    const {onCancel, modalWidth, children} = props;
    const crudContext = useContext(CRUDContext);
    const {instanceFetching} = crudContext.state;

    useEffect(() => {
        if (crudContext.state.selectedRecord) {
            crudContext.actions.read(crudContext.state.selectedRecord.id);
        }
    }, []);

    return instanceFetching ? <LoadingProgress/> : <Modal visible
                                                          destroyOnClose
                                                          closable
                                                          footer={null}
                                                          width={modalWidth}
                                                          onCancel={onCancel}>
        {children}
    </Modal>;
};
DataModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    modalWidth: PropTypes.number
};


/**
 * DataTable header.
 * @param props
 * @returns {*}
 * @constructor
 */
const Header = (props) => {
    const {header, onCreateButtonClick, createButton} = props;

    return <div className={'datatable-header'}>
        <div className={'pull-right'}>
            {createButton && createButton}
            {!createButton && <Button type={'primary'} onClick={onCreateButtonClick}>
                <Icon type={'plus'}/> Add
            </Button>}
        </div>
        <h1>{header}</h1>
        <div className={'clearfix'}/>
    </div>;
};
Header.propTypes = {
    header: PropTypes.string.isRequired,
    onCreateButtonClick: PropTypes.func,
    createButton: PropTypes.object
};

/**
 * DataTable composite component.
 * @param props
 * @returns {*}
 * @constructor
 */
export default function DataTable(props) {
    const {
        header,
        hideHeader,
        columns,
        actions,
        pagination,
        form,
        forms,
        fetchingParams,
        modalWidth,
        modalWidths,
        formHandler,
        formHandlers,
        rowKey,
        createButton
    } = props;

    const CreateForm = forms && forms.create ? forms.create : form;
    const UpdateForm = forms && forms.update ? forms.update : form;

    const CreatemodalWidth = modalWidths && modalWidths.create ? modalWidths.create : modalWidth;
    const UpdateModalWidth = modalWidths && modalWidths.update ? modalWidths.update : modalWidth;

    const createHandler = formHandlers && formHandlers.create ? formHandlers.create : formHandler;
    const updateHandler = formHandlers && formHandlers.update ? formHandlers.update : formHandler;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const crudContext = useContext(CRUDContext);

    const {instance, isSubmitting} = crudContext.state;

    return <div className={'datatable-wrapper'}>
        {!hideHeader && <Header header={header}
                                createButton={createButton}
                                onCreateButtonClick={() => {
                                    crudContext.actions.setSelectedRecord(undefined);
                                    setIsCreateModalOpen(true);
                                }}/>}

        <InnerTable columns={columns}
                    actions={actions}
                    rowKey={rowKey}
                    fetchingParams={fetchingParams}
                    pagination={pagination}
                    onUpdateClick={(record) => {
                        crudContext.actions.setSelectedRecord(record);
                        setIsUpdateModalOpen(true);
                    }}
                    onDeleteClick={(record) => {
                        crudContext.actions.setSelectedRecord(record);
                        setIsDeleteModalOpen(true);
                    }}/>

        {isCreateModalOpen && CreateForm && <DataModal
            onCancel={() => {
                setIsCreateModalOpen(false)
            }}
            modalWidth={CreatemodalWidth ? CreatemodalWidth : DEFAULT_MODAL_WIDTH}>
            <CreateForm
                onSubmit={(data, config) => {
                    if (createHandler) {
                        createHandler(data, config);
                    } else {
                        if (!config.onSuccess) {
                            config.onSuccess = () => {
                                setIsCreateModalOpen(false);
                                message.success('Data saved');
                                crudContext.actions.fetch();
                            };
                        }
                        crudContext.actions.create(data, config);
                    }
                }}
                isSubmitting={isSubmitting}
                onCancel={() => {
                    setIsCreateModalOpen(false);
                }}/>
        </DataModal>}

        {isUpdateModalOpen && UpdateForm && <DataModal
            onCancel={() => {
                setIsUpdateModalOpen(false);
            }}
            modalWidth={UpdateModalWidth ? UpdateModalWidth : DEFAULT_MODAL_WIDTH}>
            <UpdateForm
                onSubmit={(data, config, instance) => {
                    if (updateHandler) {
                        updateHandler(data, config, instance);
                    } else {
                        if (!config.onSuccess) {
                            config.onSuccess = () => {
                                setIsUpdateModalOpen(false);
                                crudContext.actions.fetch();
                                crudContext.actions.setSelectedRecord(undefined);
                                message.success('Data saved');
                            };
                        }
                        crudContext.actions.update(data, config, instance);
                    }
                }}
                isSubmitting={isSubmitting}
                instance={instance}
                onCancel={() => {
                    setIsUpdateModalOpen(false);
                }}/>
        </DataModal>}

        {isDeleteModalOpen && <DataModal
            onCancel={() => {
                setIsDeleteModalOpen(false);
            }}
            modalWidth={UpdateModalWidth ? UpdateModalWidth : DEFAULT_MODAL_WIDTH}>
            <div className={'confirmation'}>
                <Alert type={'warning'} showIcon message={'Are you sure that you want to delete this object?'}/>
                <div className={'form-actions'} style={{marginBottom: 20}}>
                    <Button type={'default'} onClick={() => {
                        setIsDeleteModalOpen(false);
                    }}>Cancel</Button>&nbsp;
                    <Button type={'danger'} onClick={() => {
                        crudContext.actions.delete({
                            onSuccess: () => {
                                setIsDeleteModalOpen(false);
                                crudContext.actions.fetch();
                                crudContext.actions.setSelectedRecord(undefined);
                                message.success('Object deleted');
                            }
                        }, instance)
                    }}>Confirm</Button>
                </div>
                <div className={'clearfix'}/>
            </div>
        </DataModal>}

    </div>
}
DataTable.propTypes = {
    header: PropTypes.string.isRequired,
    hideHeader: PropTypes.bool,

    form: PropTypes.func,
    forms: PropTypes.object,

    fetchingParams: PropTypes.object,

    columns: PropTypes.array.isRequired,
    actions: PropTypes.array,

    formHandler: PropTypes.func,
    formHandlers: PropTypes.object,

    modalWidth: PropTypes.string,
    modalWidths: PropTypes.object,

    rowKey: PropTypes.string,

    createButton: PropTypes.object
};