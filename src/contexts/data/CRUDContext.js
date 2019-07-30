import React from 'react';

import api, {getErrorsFromResponse} from '../../api';

export const CRUDContext = React.createContext();

export class CRUDContextProvider extends React.Component {
    state = {
        rows: [],
        fetching: false,

        selectedRecord: undefined,

        instance: undefined,
        instanceFetching: false,

        isSubmitting: false,

        createUpdateErrors: undefined
    };

    setSelectedRecord = (record) => {
        this.setState({
            selectedRecord: record
        });
    };

    fetch = (config = {}) => {
        const {url} = this.props;

        this.setState({
            rows: [],
            fetching: true
        });
        api.get(url, config.requestConfig ? config.requestConfig : undefined).then(response => {
            this.setState({
                rows: response.data,
                fetching: false
            });
            if (config.onSuccess) {
                config.onSuccess(response.data);
            }
        }).catch(error => {
            if (config.onError) {
                config.onError({errors: getErrorsFromResponse(error)});
            } else {
                console.error(error);
            }
        });
    };

    create = (data, config) => {
        const {url} = this.props;

        this.setState({
            isSubmitting: true,
            createUpdateErrors: undefined,
        });

        api.post(
            url,
            data,
            config.requestConfig ? config.requestConfig : undefined
        ).then(response => {
            this.setState({
                isSubmitting: false,
                instance: response.data
            });
            if (config.onSuccess) {
                config.onSuccess(response.data);
            }
        }).catch(error => {
            const errors = getErrorsFromResponse(error);
            this.setState({
                isSubmitting: false,
                createUpdateErrors: errors
            });
            if (config.onError) {
                config.onError(errors);
            } else {
                console.error(error);
            }
        });
    };

    read = (id) => {
        const {url} = this.props;

        this.setState({
            instanceFetching: true,
            instance: undefined,
        });

        api.get(`${url}${id}/`).then(response => {
            this.setState({
                instanceFetching: false,
                instance: response.data
            });
        }).catch(error => {
            console.log(error);
        });
    };

    update = (data, config, instance) => {
        const {url} = this.props;

        this.setState({
            isSubmitting: true,
            createUpdateErrors: undefined,
        });

        api.patch(
            `${url}${instance.id}/`,
            data,
            config.requestConfig ? config.requestConfig : undefined
        ).then(response => {
            this.setState({
                isSubmitting: false,
                instance: response.data
            });
            if (config.onSuccess) {
                config.onSuccess(response.data);
            }
        }).catch(error => {
            const errors = getErrorsFromResponse(error);
            this.setState({
                isSubmitting: false,
                createUpdateErrors: errors
            });
            if (config.onError) {
                config.onError(errors);
            } else {
                console.error(error);
            }
        });
    };

    delete = (config, instance) => {
        const {url} = this.props;

        this.setState({
            isSubmitting: true,
            deleteErrors: undefined
        });

        api.delete(`${url}${instance.id}`).then(response => {
            this.setState({
                isSubmitting: false,
                instance: undefined,
            });
            if (config.onSuccess) {
                config.onSuccess(response.data);
            }
        }).catch(error => {
            const errors = getErrorsFromResponse(error);
            this.setState({
                isSubmitting: false,
                deleteErrors: errors
            });
            if (config.onError) {
                config.onError({errors: errors});
            } else {
                console.error(error);
            }
        })
    };

    getActions = () => {
        return {
            setSelectedRecord: this.setSelectedRecord,
            create: this.create,
            read: this.read,
            update: this.update,
            delete: this.delete,
            fetch: this.fetch
        }
    };

    render = () => {
        return <CRUDContext.Provider value={{
            state: this.state,
            actions: this.getActions()
        }}>
            {this.props.children}
        </CRUDContext.Provider>;
    }
}
