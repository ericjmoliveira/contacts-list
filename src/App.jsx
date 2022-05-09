import { useState, useEffect } from 'react';

import styles from './App.module.css';

function App() {
    const initialState = { id: null, name: '', email: '', phone: '' };
    const [formData, setFormData] = useState(initialState);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    const [create, setCreate] = useState(true);
    const [deleteBox, setDeleteBox] = useState({ state: false, id: null });
    const [contactsList, setContactsList] = useState([]);

    const handleFormSubmit = async (e, create = true) => {
        e.preventDefault();

        if (create) handleCreate(formData);
        else handleUpdate(formData);

        setCreate(true);
        setFormData(initialState);
        setShowForm(false);
        setFetchData(true);
    };

    // CREATE
    const handleCreate = async (contactData) => {
        await fetch('http://localhost:5000/contacts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });
    };

    useEffect(() => {
        // READ
        const handleRead = async () => {
            const response = await fetch('http://localhost:5000/contacts', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            const data = await response.json();

            setContactsList(data);
            setFetchData(false);
        };

        handleRead();
    }, [fetchData]);

    // UPDATE
    const handleUpdate = async (contactData) => {
        await fetch(`http://localhost:5000/contacts/${contactData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });
    };

    // DELETE
    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/contacts/${id}`, {
            method: 'DELETE',
        });

        setDeleteBox({ state: false, id: null });
        setFetchData(true);
    };

    return (
        <div className={styles.App}>
            <div className={styles['header-container']}>
                <button className={styles['create-btn']} onClick={() => setShowForm(true)}>
                    Add contact
                </button>
                <input
                    type="text"
                    placeholder="Search for a contact name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                />
            </div>

            {showForm && (
                <div className={styles['form-container']}>
                    <form
                        className={styles['contact-form']}
                        onSubmit={
                            create ? (e) => handleFormSubmit(e) : (e) => handleFormSubmit(e, false)
                        }
                    >
                        <div className={styles['form-header']}>
                            <h2>{create ? 'Add new' : 'Edit'} contact</h2>
                            <button
                                className={styles['cancel-btn']}
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className={styles['form-control']}>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Contact name"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, [e.target.id]: e.target.value });
                                }}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles['form-control']}>
                            <label htmlFor="email">E-mail:</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Contact e-mail"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, [e.target.id]: e.target.value });
                                }}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles['form-control']}>
                            <label htmlFor="name">Phone:</label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="Contact phone"
                                value={formData.phone}
                                onChange={(e) => {
                                    setFormData({ ...formData, [e.target.id]: e.target.value });
                                }}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <button className={styles['submit-btn']}>
                            {create ? 'Add new contact' : 'Save changes'}
                        </button>
                    </form>
                </div>
            )}

            <div className={styles['list-container']}>
                <ul className={styles['contacts-list']}>
                    <li>
                        <span>NAME</span>
                        <span>EMAIL</span>
                        <span>PHONE</span>
                        <span>ACTIONS</span>
                    </li>
                    {contactsList.length > 0 ? (
                        contactsList
                            .filter((contact) => {
                                if (searchQuery === '') {
                                    return contact;
                                } else if (
                                    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
                                ) {
                                    return contact;
                                }
                            })
                            .map((contact) => (
                                <li key={contact.id}>
                                    <span>{contact.name}</span>
                                    <span>{contact.email}</span>
                                    <span>{contact.phone}</span>
                                    <span>
                                        <button
                                            className={styles['edit-btn']}
                                            onClick={() => {
                                                setShowForm(true);
                                                setCreate(false);
                                                setFormData(contact);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={styles['delete-btn']}
                                            onClick={() =>
                                                setDeleteBox({ state: true, id: contact.id })
                                            }
                                        >
                                            Remove
                                        </button>
                                    </span>
                                </li>
                            ))
                    ) : (
                        <p>You have no contacts yet</p>
                    )}
                </ul>
            </div>

            {deleteBox.state && (
                <div className={styles['delete-confirm-container']}>
                    <div className={styles['delete-box']}>
                        <p>Are you sure want to delete this contact?</p>
                        <div className={styles['buttons-container']}>
                            <button
                                className={styles['confirm-delete-btn']}
                                onClick={() => handleDelete(deleteBox.id)}
                            >
                                Yes
                            </button>
                            <button
                                className={styles['cancel-delete-btn']}
                                onClick={() => setDeleteBox({ state: false, id: null })}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
