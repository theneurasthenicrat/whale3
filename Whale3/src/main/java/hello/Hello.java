package hello;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * This file serves two things. 1) Check that Java is compiled as well. 2)
 * Declare a dependency on an EntityManager to make sure JPA is activated.
 * Otherwise, Glassfish does not honor the properties found in persistence.xml:
 * log settings; create db action. (I have my doubts about this behavior being
 * spec compliant.)
 */
public class Hello {
	@PersistenceContext
	private EntityManager em;
}
